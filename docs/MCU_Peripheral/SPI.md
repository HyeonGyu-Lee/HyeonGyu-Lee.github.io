---
layout: default
title: SPI
has_children: false
published_date: 2026-10-14-13-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 8
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/SPI'
redirect_from:
 - "/3f91b412900a8135840edb0bb5672e10"
 - "/차량_통신/SPI"
---
## 센서 register를 읽기 위해 주소와 dummy byte를 보내는 상황


SCK는 bit 이동 시점을 만들고 CS는 transaction 경계를 만든다. MOSI와 MISO의 바이트는 동시에 이동하지만 응용에서 유효한 구간은 장치 protocol에 따라 다르다. Clock mode와 command format을 함께 이해해야 한다.


> SPI는 SCK와 데이터 신호, CS(Chip Select)를 사용하는 동기식 직렬 통신이다. 컨트롤러가 클록을 만들고 주변장치와 프레임을 교환한다. CPOL·CPHA·bitrate뿐 아니라 주변장치별 명령 형식·CS 유지 조건·읽기 더미 클록·응답 지연을 데이터시트에 맞춰 구현해야 한다.


## 적용 범위와 개발 환경


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
MCU는 S32K312, 주변장치는 아직 특정하지 않은 상태를 기준으로 한다. S32K3 프로젝트에서는 일반적으로 S32 Design Studio와 S32 RTD의 LPSPI IP 드라이버 또는 AUTOSAR Spi 드라이버를 사용한다. S32K1용 S32 SDK의 LPSPI_DRV_* API를 S32K312 코드에 그대로 복사하지 않는다. 설치한 RTD 버전·패키지의 예제와 생성 헤더에서 실제 함수명과 설정 구조체를 확인한다.
</div>
</div>
</blockquote>



## 1. 배선과 전기 조건부터 확인


| **Signal**      | **MCU 기준 방향 (Controller)** | **역할**             |
| --------------- | -------------------------- | ------------------ |
| **SCK**         | 출력                         | 컨트롤러가 생성하는 클록      |
| **SOUT / MOSI** | 출력                         | 컨트롤러 → 주변장치 데이터 송신 |
| **SIN / MISO**  | 입력                         | 주변장치 → 컨트롤러 데이터 수신 |
| **PCS / CS**    | 출력                         | 통신 대상 선택           |


MCU가 Controller인 구성을 기준으로 한다. 장치 데이터시트의 신호 방향을 MCU 기준으로 대조한다.

- 공통 접지, I/O 전압과 허용 범위, 레벨 시프터의 방향·지연, CS 비활성 레벨을 확인한다. active-low CS가 일반적이지만 반드시 장치 규격을 따른다.
- 보드 커넥터 이름만 보지 말고 S32K312 패키지 핀 mux와 회로도를 대조한다. 출력 pad 설정뿐 아니라 입력 경로 선택도 필요할 수 있다. 사용하지 않는 주변장치의 CS가 비활성 상태인지 확인한다.
- SPI는 보통 보드 내부의 짧은 배선에서 사용한다. 긴 하네스 연결은 파형·접지·EMC 문제가 커지므로 별도 물리 계층을 검토한다. SPI 버스에 CAN처럼 임의의 120Ω 종단을 추가하지 않는다.

## 2. CPOL·CPHA와 비트 순서


| **Mode** | **CPOL** | **CPHA** | **SCK idle** | **Sample edge** | **Change edge** |
| -------- | -------- | -------- | ------------ | --------------- | --------------- |
| **0**    | 0        | 0        | Low          | 첫 번째 (rising)   | 두 번째 (falling)  |
| **1**    | 0        | 1        | Low          | 두 번째 (falling)  | 첫 번째 (rising)   |
| **2**    | 1        | 0        | High         | 첫 번째 (falling)  | 두 번째 (rising)   |
| **3**    | 1        | 1        | High         | 두 번째 (rising)   | 첫 번째 (falling)  |


CPHA=0에서는 첫 샘플링 edge 전에 첫 데이터 비트가 준비되어야 한다. 주변장치가 요구하는 mode·MSB/LSB first·프레임 길이를 맞춘다. 로직 분석기의 decode 설정도 동일해야 한다. 데이터가 1비트씩 밀리면 CPHA만 추측해서 바꾸기보다 CS·클록 idle·첫 edge와 setup/hold를 파형에서 확인한다.


## 3. S32K312 LPSPI 설정 순서

- 프로젝트 타깃·패키지를 S32K312로 선택하고 해당 RTD 버전의 LPSPI 예제를 기준으로 시작한다. IP 드라이버 방식과 AUTOSAR MCAL 방식을 혼합 초기화하지 않는다.
- Clock 설정에서 LPSPI functional clock의 소스·divider·gate를 구성한다. 코어 클록이 아닌 실제 LPSPI 입력 주파수를 계산하고 생성된 clock 설정으로 확인한다.
- Pins 설정에서 사용할 LPSPI 인스턴스와 SCK·SOUT·SIN·PCS를 연결한다. 회로도에 따라 hardware PCS 또는 GPIO CS를 선택한다. 예제 핀 번호를 다른 패키지에 그대로 적용하지 않는다.
- 컨트롤러 모드, baudrate, CPOL·CPHA, MSB/LSB, 프레임 비트 수, PCS polarity와 CS 연속 유지 여부를 설정한다. peripheral 최대 클록보다 낮은 속도부터 시작한다.
- PCS→SCK, 마지막 SCK→PCS, 연속 transfer 사이 지연을 주변장치 데이터시트의 ns 최소값에 맞춘다. 낮은 bitrate에서 정상이어도 이 지연값이 부족하면 고속 전환 후 실패할 수 있다.
- 첫 확인은 polling 방식의 짧은 transfer로 진행한다. 동작 확인 후 IRQ·DMA·callback을 추가한다. 비동기 송수신 버퍼는 완료 전까지 유효해야 하고 CPU가 임의 수정하면 안 된다.

## 4. LPSPI SCK 계산 예제


```text
LPSPI의 일반적인 분주 모델:
f_SCK = f_functional / (2^PRESCALE × (SCKDIV + 2))

가정: f_functional = 80 MHz, 목표 f_SCK = 5 MHz
PRESCALE = 1 → 실제 prescaler = 2
SCKDIV = 6
f_SCK = 80 MHz / (2 × 8) = 5 MHz
SCK 주기 = 200 ns

다른 조합: PRESCALE=0, SCKDIV=14도 5 MHz
실제 필드 범위와 주변 타이밍은 Reference Manual로 확인한다.
```



80 MHz는 계산을 위한 가정이며 사용 보드의 기본값이라는 뜻이 아니다. 설정 도구가 이미 Hz 단위 bitrate를 받아 분주값을 계산한다면 레지스터 인코딩 값을 API의 bitrate에 넣지 않는다. 계산 후 생성 코드의 선택된 prescaler/divider와 오실로스코프의 SCK 주기를 대조한다. 목표 속도를 정확히 만들 수 없으면 주변장치 최대 속도를 넘지 않는 후보를 선택한다.


```c
#include <assert.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
int main(void) {
 const uint64_t clock_hz = 80000000ULL, maximum = 5000000ULL;
 unsigned best_p = 0, best_d = 0;
 uint64_t best_divisor = UINT64_MAX;
 for (unsigned p = 0; p < 8; ++p)
  for (unsigned d = 0; d < 256; ++d) {
   uint64_t divisor = (1ULL << p) * (d + 2U);
   if (clock_hz <= maximum * divisor && divisor < best_divisor) {
    best_divisor = divisor; best_p = p; best_d = d;
   }
  }
 assert(best_divisor != UINT64_MAX);
 printf("PRESCALE=%u SCKDIV=%u SCK=%.1f Hz\n", best_p, best_d,
        (double)clock_hz / (double)best_divisor);
 assert(clock_hz / best_divisor == maximum);
 return 0;
}
```



## 5. CS 유지와 레지스터 읽기 transaction


다음은 설명용 가상 센서다. 실제 부품의 명령 코드가 아니다. 가상 계약은 8비트 프레임, mode 0, MSB first, 읽기 명령 0x80 \| register, 명령 다음 바이트에 응답, 전체 두 바이트 동안 CS Low로 정의한다.

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/MCU_Peripheral/SPI/1.webp" href="/_images/MCU_Peripheral/SPI/1.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" decoding="async" width="1774" height="887" alt="" src="/_images/MCU_Peripheral/SPI/1.webp" />
<figcaption>SPI Mode 0의 가상 Register Read 예제. 0x8F = READ(0x80) \| Register(0x0F). CS를 유지한 채 0x00을 dummy로 송신해 rx[1]을 읽고 rx[0]은 무시한다. 실제 측정 파형이 아니며, 명령 형식과 응답 위치는 장치 데이터시트에 따른다.</figcaption>
</figure>
</a>
</div>
</div>
</div>



```c
/* 개념 코드: board_spi_transfer는 직접 구현할 보드 어댑터다.
 * RTD의 실제 함수명이 아니며 예제 센서 계약에만 해당한다.
 * transfer는 두 바이트 전체 동안 CS를 유지하고 완료 후 반환해야 한다.
 */
#include <stddef.h>
#include <stdint.h>
extern int board_spi_transfer(const uint8_t *tx, uint8_t *rx,
                              size_t length, uint32_t timeout_us);

int read_example_register(uint8_t *value)
{
    if (value == NULL) return -1;
    uint8_t tx[2] = {0x8F, 0x00};
    uint8_t rx[2] = {0};
    int status = board_spi_transfer(tx, rx, sizeof(tx), 1000);
    if (status != 0) return status;
    *value = rx[1];
    return 0;
}
```



SPI는 클록이 있어야 수신한다. 읽기만 하더라도 dummy TX가 필요할 수 있다. 송신 명령과 수신 데이터 사이에 PCS가 자동으로 올라가면 일부 주변장치는 명령을 종료하므로 하나의 transaction으로 구성하거나 드라이버의 continuous PCS 설정을 사용한다. null TX/RX 허용 여부와 dummy fill 값은 드라이버마다 다르다.


## 6. RTD IP 드라이버와 AUTOSAR Spi 설정 구분


RTD IP 드라이버를 사용할 때는 Lpspi_Ip 계열의 설치 예제와 생성 설정을 확인한다. 함수의 length가 바이트인지 프레임인지, timeout 단위, 동기/비동기 완료 조건, RX/TX 버퍼 정렬과 프레임 폭 제약을 헤더에서 확인한다. LPSPI 초기화 전에 클록과 pin mux가 유효해야 한다.


AUTOSAR Spi는 Channel(데이터와 buffer), Job(CS 대상·통신 속성), Sequence(Job 실행 순서)로 구성한다. EB/IB 버퍼 방식, Spi_SetupEB/Spi_WriteIB, 동기 또는 비동기 송수신 경로를 프로젝트 설정에 맞춰 사용한다. Job 사이 CS가 유지된다고 가정하지 말고 외부 장치 transaction 요구와 구성 옵션을 대조한다. API 가용성은 설정에 따라 달라진다.


## 7. DMA와 연속 송수신

- DMA 채널·요청 소스·FIFO watermark·전송 폭을 일치시킨다. 16비트 프레임을 8비트 버퍼로 다루거나 length 단위를 혼동하면 순서가 바뀌거나 끝부분이 유실될 수 있다.
- 비동기 전송에 함수 내부 임시 배열을 넘기고 바로 반환하지 않는다. 완료 callback 또는 상태 확인 전까지 버퍼 수명과 소유권을 유지한다.
- 메모리 접근성·정렬·캐시 일관성 처리는 해당 MCU와 메모리 영역 설정에 맞춘다. 모든 S32K 계열에 동일한 cache maintenance 호출을 넣지 않는다.
- DMA 완료가 실제 마지막 SCK 종료와 같은 의미인지 확인한다. CS 해제는 주변장치 요구와 드라이버 완료 정의를 따르며 TX FIFO에 썼다는 이유만으로 직접 GPIO CS를 올리지 않는다.

## 8. 오류별 점검과 검증 과제


| **증상**             | **확인 및 대응**                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **수신이 모두 0xFF**    | MISO 미연결·입력 mux·CS 미선택·전원·명령 형식을 확인한다. 모두 0x00도 실제 응답이라고 단정하지 않는다.                                        |
| **일부 값이 1비트 이동**   | CPOL/CPHA, 첫 비트 setup, 마지막 edge를 확인한다. 모든 값의 바이트 순서가 바뀌면 frame size·MSB/LSB·CPU 메모리 byte order를 구분해 점검한다. |
| **저속 정상·고속 실패**    | SCK 주파수, 데이터 setup/hold, 레벨 시프터, 배선 ringing과 CS 지연을 측정한다. clock divider만 바꾸고 해결되었다고 끝내지 않는다.              |
| **첫 transfer만 정상** | FIFO 상태·오류 flag clear·PCS 해제·버퍼 재사용·비동기 완료 확인을 점검한다.                                                      |


검증 과제: loopback으로 TX/RX 일치 확인 → 실제 장치 ID 읽기 → 읽기 전용·가역 설정 register 확인 → 반복 송수신 및 timeout 주입 → DMA 전환 순으로 진행한다. loopback 성공은 실제 장치의 명령·CS 조건을 검증하지 않는다. 결과에는 RTD 버전, pin mux, functional clock, SCK 실측값, CPOL/CPHA, PCS 파형과 송수신 바이트를 함께 기록한다.


## 이해를 확인하는 질문


> 8 clocks를 보냈는데 유효한 데이터가 없는 이유는 무엇일까?


첫 byte가 command 또는 address일 수 있다. 유효 응답의 시작 위치, dummy cycle, CS 유지 조건과 CPOL·CPHA를 장치 규격과 대조한다.

