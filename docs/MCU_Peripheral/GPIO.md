---
layout: default
title: GPIO
has_children: false
published_date: 2026-10-14-15-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 1
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/GPIO'
redirect_from:
 - "/3f91b412900a81e89986d913d9b0c254"
---
## 버튼 입력과 LED 출력을 같은 pin 설정으로 다루려는 상황


Pin mux, 방향, pull resistor, 출력 방식은 각각 역할이 다르다. GPIO register의 값은 pad의 전압이나 외부 회로의 실제 동작과 항상 같지 않다. 회로와 pin 상태를 함께 보아야 한다.


> GPIO 설정은 핀 방향만 고르는 작업이 아니다. 주변장치 mux, 입력 경로, 출력 초기값, pull, 전기적 구동 능력과 인터럽트 조건을 회로에 맞춰 구성해야 한다.


## S32K312 설정 순서

- 회로도에서 신호 이름·패키지 핀·전압 도메인·active polarity를 확인한다. 미사용 핀과 디버그/부트 관련 핀은 보드 정책에 따른다.
- Pins 도구에서 GPIO mux와 input/output buffer를 선택한다. 외부 주변장치 입력에는 입력 mux 선택이 추가로 필요할 수 있다. 출력으로 쓸 핀의 초기값을 안전한 비활성 레벨로 정의한다.
- RTD의 Siul2_Port/Siul2_Dio 계열 또는 AUTOSAR Port/Dio 계층을 선택한다. 실제 API는 설치 예제에서 확인한다. 생성 코드와 수동 레지스터 쓰기를 혼용하지 않는다.
- 외부 pull 저항 유무·내부 pull 지원 및 강도를 확인한다. 외부에서 강하게 구동하는 신호에 반대 pull을 걸지 않는다. floating 입력을 그대로 방치하지 않는다.
- 출력 latch의 초기값을 준비한 후 출력 buffer를 활성화하는 등 드라이버가 보장하는 초기화 순서를 확인한다. EN/RESET/CS 핀에서 부팅 순간의 원치 않는 펄스를 측정한다.

## 입출력 어댑터 예제


다음은 보드 레벨의 논리 이름과 전기 극성을 분리하는 예제다. 실제 GPIO 접근·동시성 처리는 RTD 드라이버와 보드 계층에서 구현한다.


```c
#include <stdbool.h>
extern bool board_read_input(unsigned pin);
extern void board_write_output(unsigned pin, bool high);
enum { BUTTON_PIN = 0, LED_PIN = 1 }; /* 실제 핀 번호가 아닌 논리 ID */

bool button_pressed(void) { return !board_read_input(BUTTON_PIN); }
void led_on(bool on) { board_write_output(LED_PIN, on); }
```



## 인터럽트와 동시 접근


S32K312의 외부 인터럽트 사용 가능 핀·라인·라우팅을 확인한다. 모든 GPIO가 임의의 IRQ에 연결된다고 가정하지 않는다. RTD 외부 인터럽트 예제의 flag clear·handler 등록·NVIC 설정을 사용한다. ISR에서는 시각 기록·이벤트 전달만 하고 긴 delay나 통신을 하지 않는다.


공유 포트에 read-modify-write를 수행하면 다른 실행 문맥의 비트 변경을 잃을 수 있다. 드라이버가 제공하는 원자적 set/clear 또는 적절한 임계 구역을 사용한다. volatile은 최적화 관련 접근 제어일 뿐 원자성이나 스레드 동기화를 보장하지 않는다.


## 검증

- 입력에 Low/High를 각각 인가하고 코드 값과 실제 핀 전압을 비교한다. 해당 핀의 절대 최대 전압·5V 허용 여부는 데이터시트로 확인한다.
- 출력의 부하 전류·상승/하강 시간을 측정한다. 모터·릴레이·고전류 LED를 GPIO로 직접 구동하지 않고 적합한 구동 회로를 사용한다.
- 부팅·리셋·저전력 진입/복귀 시 EN/CS 출력의 glitch와 입력 재설정을 점검한다.

## LED On/Off와 Output 설정


LED에는 current limiting resistor 또는 전류 driver가 필요하다. 대략적인 저항 계산 R=(V_supply−V_LED−V_switch)/I_LED를 시작점으로 전압·forward voltage·전력 허용오차를 확인한다. MCU pin과 port의 총 전류 한계를 넘는 부하는 transistor/driver로 구동한다.


Active-high/low와 부팅·reset·pin mux 전환 중 output 초기값을 정의한다. GPIO로 On/Off를 구현하고 밝기 조절은 PWM 문서의 timer output·reload 정책으로 확장한다. ISR의 소프트웨어 toggle로 고정 frequency·duty를 보장했다고 가정하지 않는다.


## 이해를 확인하는 질문


> 출력 register가 1이면 LED는 반드시 켜질까?


LED의 active polarity, 배선, 전류 제한과 pin mux에 따라 달라진다. Register 값과 pad 전압, LED 전류를 구분한다.

