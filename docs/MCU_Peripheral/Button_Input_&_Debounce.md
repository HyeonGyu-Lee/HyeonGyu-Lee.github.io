---
layout: default
title: Button Input & Debounce
has_children: false
published_date: 2026-10-14-15-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 2
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/Button_Input_&_Debounce'
redirect_from:
 - "/3f91b412900a812d8969f4adcff04f00"
 - "/MCU_Peripheral/물리_버튼"
---
## 한 번 누른 버튼에서 여러 press event가 발생하는 상황


접점의 bounce는 전기적 변화이고 press·release·long press는 시간 조건이 있는 논리 event다. Raw input을 먼저 안정 상태로 변환한 뒤 사용자 동작을 분류해야 한다.


> 물리 버튼은 접점 bounce를 필터링한 뒤 pressed/released 이벤트로 변환한다. 길게 누름·반복 입력은 안정화된 상태 위에서 별도 상태 머신으로 구현한다.


## 입력 회로와 GPIO 설정


예시는 pull-up 입력과 버튼을 통한 GND 연결을 가정한다. 미눌림 High, 눌림 Low다. 회로가 pull-down이면 극성을 반대로 처리한다. 내부 pull만으로 충분한지 배선 길이·EMC·저전력 조건을 검토하고 필요한 RC 필터·ESD 회로를 설계한다.


## 시간 기반 debounce 예제

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/MCU_Peripheral/Button_Input_&_Debounce/1.webp" href="/_images/MCU_Peripheral/Button_Input_&_Debounce/1.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" decoding="async" width="1774" height="887" alt="" src="/_images/MCU_Peripheral/Button_Input_&_Debounce/1.webp" />
<figcaption>Pull-up/active-low 버튼의 설명용 파형이다. 마지막 bounce가 10 ms에서 끝나고 20 ms 동안 안정된 뒤 30 ms에 press 이벤트가 한 번 발생한다. 실제 측정 파형이 아니다.</figcaption>
</figure>
</a>
</div>
</div>
</div>



<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
그림 읽기와 실측 확인: Raw GPIO와 pressed=true로 정규화한 값은 반대다. 그림은 edge가 1 ms polling 시점에 정렬된 예제이며, 실제 확인 시점에는 polling 지연이 추가될 수 있다. Bounce 중에는 안정화 timer가 다시 시작된다.
</div>
</div>
</blockquote>



1 ms 주기 작업에서 다음 함수를 호출한다. 20 ms는 실습용 시작값으로 실제 버튼 bounce와 요구 응답시간을 측정해 조정한다. now_ms는 단조 증가하는 uint32_t tick이며 짧은 간격으로 호출한다.


```c
#include <stdbool.h>
#include <stdint.h>
typedef struct {
    bool candidate, stable;
    uint32_t changed_at;
} Button;
void button_init(Button *b, bool raw, uint32_t now) {
    b->candidate = raw; b->stable = raw; b->changed_at = now;
}
/* true 반환 시 stable 값이 새 상태: true=pressed, false=released */
bool button_update(Button *b, bool raw, uint32_t now) {
    if (raw != b->candidate) {
        b->candidate = raw;
        b->changed_at = now;
    }
    if (b->stable != b->candidate &&
        (uint32_t)(now - b->changed_at) >= 20U) {
        b->stable = b->candidate;
        return true;
    }
    return false;
}
```



raw에는 전기 레벨이 아니라 눌림=true로 변환한 값을 넣는다. 초기화 시 현재 상태를 저장하므로 부팅 때 이미 눌린 버튼을 새 press 이벤트로 처리하지 않는다. 부팅 눌림을 의미 있는 입력으로 사용할지는 제품 요구에 따라 별도로 정의한다.


## 짧게 누름·길게 누름 처리

- pressed 이벤트에서 시작 tick과 long_sent=false를 저장한다. 안정 상태가 pressed이고 경과시간이 800 ms 이상이면 LONG 이벤트를 한 번만 발생시킨다.
- released 이벤트에서 long_sent가 false인 경우에만 SHORT 이벤트를 발생시킨다. LONG 이후 release를 SHORT로 중복 처리하지 않는다.
- 더블클릭은 첫 release 뒤 대기 창을 둔다. 즉시 SHORT를 내보내면 DOUBLE이 뒤늦게 발생할 수 있으므로 이벤트 정책을 먼저 정한다.

## 인터럽트 사용 시


edge IRQ에서 20 ms busy wait를 하지 않는다. IRQ는 버튼 활동을 알리고 실제 안정화는 주기 작업에서 수행한다. 저전력 wake-up은 첫 edge로 깨우되, 깨어난 뒤 debounce 결과로 사용자 입력을 확정한다. level IRQ의 경우 flag와 활성 레벨 때문에 반복 진입하지 않는지 확인한다.


## 검증 시나리오

- 0/1이 2~5 ms 간격으로 흔들리는 입력 뒤 20 ms 안정 상태를 주고 이벤트가 한 번만 나오는지 확인한다.
- 짧게 누름·길게 누름·계속 누름·동시 버튼·tick wraparound·부팅 눌림·버튼 stuck를 검증한다.
- 주기 작업 지연 시 debounce 응답 지연과 이벤트 누락을 확인한다. 긴 배선의 노이즈를 소프트웨어 debounce만으로 해결하려 하지 않는다.

## 이해를 확인하는 질문


> Interrupt의 첫 edge만 받아도 버튼 입력이 완성될까?


Release와 bounce를 구분할 시간 정보가 부족하다. 안정 시간, active polarity와 event 재발행 조건을 포함한 상태 모델이 필요하다.

