---
layout: default
title: "CAN FD Configuration"
has_children: false
published_date: 2026-10-14T13:46:00.000Z
last_modified_date: 2026-10-14T13:53:00.000Z
nav_order: 2
parent: "CAN Controller"
permalink: '/MCU_Peripheral/CAN_Controller/CAN_FD_Configuration'
redirect_from:
 - "/3f91b412900a8146a610f03107f8d64e"
---

## Nominal phase는 정상인데 BRS 이후 error가 증가하는 상황

Data phase의 짧은 bit time은 transceiver와 bus delay, sample point에 더 민감하다. Data timing과 TDC를 nominal timing에서 분리해 이해하고 controller IP별 encoding을 적용해야 한다.

## Scope


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
MCU Controller에서 Classical CAN을 CAN FD로 확장할 때 변경하는 timing·payload·RAM·driver 설정을 다룬다. 차량 네트워크의 호환성·ECU 혼재·배선 검증과 구분하여 읽는다.
</div>
</div>
</blockquote>



## 실무 설정: Classical CAN에서 CAN FD로 전환


CAN FD는 단순히 bitrate를 올리는 설정이 아니다. 컨트롤러 FD 활성화, Nominal/Data 타이밍, 프레임별 FDF·BRS, 트랜시버, payload 길이, 메시지 RAM 배치, 수신 필터와 상위 계층 버퍼를 함께 점검한다. 아래 내용은 공통 원리와 FlexCAN 계열 확인 항목이며 MCU별 레지스터 확정값은 Reference Manual과 사용 드라이버 버전에 맞춰 결정한다.


## 변경점 1: FD 기능과 프레임 플래그

- 컨트롤러 FD 기능을 활성화하고 프레임별 FDF를 선택한다. FD 지원 컨트롤러라도 전송 설정이 Classical 프레임이면 FD 프레임이 나오지 않는다.
- BRS=0: FD 프레임을 Nominal 속도로 전송한다. BRS=1: 지정된 구간에서 Data 속도로 전환한다. FD 활성화와 BRS 활성화는 서로 다른 설정이다.
- CAN FD는 RTR 원격 프레임을 지원하지 않는다. Classical CAN에서 사용하던 RTR 기반 요청은 별도 데이터 프레임 방식으로 바꿔야 한다.
- Classic 전용 노드가 FD 프레임을 오류로 처리할 수 있다. 같은 버스에 연결된 노드가 FD 수신 또는 해당 네트워크의 FD 운용 조건을 만족하는지 확인한다. FD-capable 장치가 Classical 프레임도 지원하는 것과 혼동하지 않는다.
- ISO CAN FD와 초기 non-ISO CAN FD 호환 설정을 확인한다. 지원되는 IP에서는 ISO CAN FD 모드 선택 필드가 있을 수 있으며 네트워크 전체 설정을 맞춰야 한다.

## 변경점 2: Nominal과 Data 타이밍 계산


<figure><a href="/assets/images/diagrams/canfd-timing.png" data-fslightbox="canfd"><img src="/assets/images/diagrams/canfd-timing.png" width="1774" height="887" loading="lazy" decoding="async" alt="BRS=1인 CAN FD의 설명용 시간축이다. Nominal 500 kbit/s와 Data 2 Mbit/s를 가정했으며 각각의 완전한 비트 시간은 2 μs와 0.5 μs다. 실제 측정 파형이 아니다."></a><figcaption>BRS=1인 CAN FD의 설명용 시간축이다. Nominal 500 kbit/s와 Data 2 Mbit/s를 가정했으며 각각의 완전한 비트 시간은 2 μs와 0.5 μs다. 실제 측정 파형이 아니다.</figcaption></figure>


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
그림 읽기와 실측 확인: 속도 전환은 BRS와 CRC delimiter의 Sample Point에서 일어난다. 경계 비트 전체를 한 속도로 계산하지 않는다. 전체 필드·stuff bit를 생략한 그림이므로 프레임 전송 시간을 이 그림의 폭으로 계산하지 않는다.
</div>
</div>
</blockquote>



```text
Nominal_TQ = BRP_N / f_CAN
Nominal_bitrate = f_CAN / (BRP_N × (1 + TSEG1_N + TSEG2_N))
Nominal_SP = (1 + TSEG1_N) / (1 + TSEG1_N + TSEG2_N)

Data_TQ = BRP_D / f_CAN
Data_bitrate = f_CAN / (BRP_D × (1 + TSEG1_D + TSEG2_D))
Data_SP = (1 + TSEG1_D) / (1 + TSEG1_D + TSEG2_D)
```


위 식은 두 타이밍 도메인이 같은 f_CAN을 사용하는 경우다. MCU의 실제 클록 구조를 먼저 확인한다. Nominal과 Data의 prescaler가 독립적으로 설정 가능한지, 두 값 사이 제약이 있는지, 세그먼트 최소·최대 범위를 확인한다. Nominal 속도는 중재·ACK 등 공통 구간에 적용되며 FD 전체 프레임이 Data 속도로 전송되는 것은 아니다.


## 계산 예제: 80 MHz, 500 kbit/s + 2 Mbit/s


```text
Nominal:
  BRP_N = 8, PROP = 7, PHASE1 = 8, PHASE2 = 4
  TQ_N = 100 ns, N_TQ_N = 20
  bitrate_N = 500 kbit/s, SP_N = 80%, SJW_N = 4 TQ

Data:
  BRP_D = 2, PROP = 7, PHASE1 = 8, PHASE2 = 4
  TQ_D = 25 ns, N_TQ_D = 20
  bitrate_D = 2 Mbit/s, SP_D = 80%, SJW_D = 4 TQ
  data bit time = 500 ns

계산상 대안:
  BRP_D = 1, N_TQ_D = 40이면 같은 2 Mbit/s
  다만 해당 IP의 Data 세그먼트 범위와 제약이 허용해야 한다.
```


이 수치는 산술 예제다. 일부 IP·드라이버에서는 Nominal/Data prescaler 조합이나 Data 세그먼트 값이 허용되지 않을 수 있다. 사용 IP의 타이밍 계산기 결과와 매뉴얼을 비교해야 하며 이 예제를 그대로 레지스터에 쓰는 완성 설정으로 취급하지 않는다. 80% Sample Point도 모든 배선·속도에서 최적이라는 뜻은 아니다.


## FlexCAN: FD 레지스터와 인코딩 주의점


일부 S32K1xx FlexCAN에서는 MCR.FDEN으로 FD를 켜고, CBT로 Nominal 타이밍, FDCBT로 Data 타이밍, FDCTRL로 payload 영역·TDC 등을 설정한다. 해당 IP의 메시지 버퍼 제어 필드에서 EDL(FDF 의미)·BRS 등을 선택한다. 모든 FlexCAN 인스턴스가 FD를 지원하는 것은 아니며 최신 계열의 확장 타이밍 레지스터 경로는 다를 수 있다.


FDCBT의 FPRESDIV·FPSEG1·FPSEG2·FRJW 등에서 실제값−1을 사용하더라도 FPROPSEG는 다른 인코딩을 사용하는 IP가 있다. 따라서 모든 Data 세그먼트에 일괄적으로 1을 빼는 코드를 작성하지 않는다. 드라이버의 timing 구조체도 실제값·필드값 중 무엇을 기대하는지 API 문서와 구현을 확인한다.


## 변경점 3: TDC와 Secondary Sample Point


고속 Data phase에서는 TXD → 트랜시버 → RXD 루프 지연이 한 비트 시간에 가까워질 수 있다. TDC(Transceiver Delay Compensation)는 송신 노드의 bit monitoring에 사용할 Secondary Sample Point(SSP)를 지연에 맞춰 조정한다. 일반적인 수신 Sample Point를 자동으로 바꾸거나 모든 버스 전파 지연을 해결하는 기능은 아니다.


```text
개념 모델:
  SSP 위치 = 측정한 TX→RX 지연 + 설정한 offset

가정: 해당 IP의 TDC 단위가 CAN 입력 클록 1주기이고 f_CAN = 80 MHz
  1단위 = 12.5 ns
  목표 offset 시간 = 200 ns라면 offset = 200 / 12.5 = 16
  측정 지연 = 100 ns라면 측정값 = 8
  SSP = (8 + 16) × 12.5 ns = 300 ns

주의: 위 단위와 합산 규칙을 사용하는 IP에 한한 계산 예제다.
Data_TQ = 25 ns일 때도 TDC 단위가 25 ns라고 가정하면 안 된다.
```


FlexCAN의 TDCOFF·TDCEN·측정값/실패 상태 필드 등은 IP별 의미와 범위를 확인한다. SSP 허용 범위, 측정 지연 포화, offset 제약, 자동 측정 동작 조건과 errata를 확인한다. Data bitrate별로 TDC 필요 여부를 드라이버 지침과 실제 트랜시버 지연에 근거해 결정하며 특정 속도 이상이면 항상 같은 값이라는 규칙을 만들지 않는다.


## 변경점 4: DLC와 메시지 RAM 배치


```text
DLC 코드 → FD payload 바이트
0..8 → 0..8
9 → 12
10 → 16
11 → 20
12 → 24
13 → 32
14 → 48
15 → 64
```


payload 길이 12바이트와 DLC 코드 12를 혼동하지 않는다(DLC 12는 24바이트). API가 길이(byte)를 받는지 DLC 코드를 받는지 확인한다. 9·10·11바이트 등 버스 길이로 직접 표현할 수 없는 경우에는 API 정책에 따라 허용 길이로 패딩하거나 거부한다. 패딩 값·애플리케이션 유효 길이는 송수신 계약으로 정한다.


일부 FlexCAN은 FDCTRL.MBDSR 영역별 설정으로 8/16/32/64바이트 payload 저장 크기를 선택한다. 큰 payload를 선택하면 사용 가능한 메시지 버퍼 수와 메모리 offset이 변한다. 고정 16바이트 stride의 Classical MB 포인터 계산을 그대로 사용하면 잘못된 주소에 접근할 수 있다. MAXMB, 영역 경계, FIFO와의 공존 조건, 필터, IRQ, DMA 및 상위 드라이버 버퍼 길이를 함께 확인한다.


## 변경점 5: 물리 계층과 상위 소프트웨어

- 트랜시버의 CAN FD 지원 및 보장 Data rate·루프 지연을 확인한다. 클록 계산상 5 Mbit/s가 나온다고 배선과 트랜시버도 그 속도를 보장하지는 않는다.
- 종단 저항, 스텁 길이, 커넥터, 공통 모드와 파형 ringing을 검토한다. Nominal에서는 정상이어도 BRS를 켰을 때 Data phase에서만 오류가 발생할 수 있다.
- AUTOSAR 환경에서는 Can controller baudrate 설정과 FD timing 설정, CanIf PDU 길이, 필요 시 CanTp의 FD 관련 설정·패딩·상위 버퍼를 함께 검토한다. 파라미터 이름과 단위는 AUTOSAR 릴리스·MCAL 공급사별로 다르다.
- 분석기에서도 Nominal bitrate·Data bitrate·FD·BRS 조건을 일치시킨다. 분석기가 listen-only이면 ACK를 제공하지 않으므로 별도의 정상 수신 노드가 필요하다.

## SocketCAN에서 단계적으로 FD 활성화


```bash
sudo ip link set can0 down
sudo ip link set can0 type can bitrate 500000 sample-point 0.800   dbitrate 2000000 dsample-point 0.800 fd on
sudo ip link set can0 up
ip -details -statistics link show can0

# can-utils: ## 뒤 첫 자리 0은 BRS 미사용, 1은 BRS 사용
cansend can0 123##00102030405060708
cansend can0 123##10102030405060708
# 12바이트 FD payload, BRS 사용
cansend can0 123##1000102030405060708090A0B
candump -e can0
```


실제 드라이버가 FD와 요청한 bitrate를 지원해야 한다. 출력에서 설정된 bitrate, sample-point, tq, segment와 오류 카운터를 확인한다. 지원되는 커널·드라이버에서는 TDC 설정을 별도로 제공할 수 있으나 옵션 이름·단위·범위가 다르므로 ip link help와 드라이버 문서를 확인한다.


## 재현 가능한 계산기: 타이밍 후보 탐색


다음 C 예제는 가능한 정수 분주·TQ 조합을 탐색한다. 입력 범위는 설명용이며 칩의 허용 범위로 바꾸어야 한다. PROP/PHASE1 분할·SJW·Nominal/Data 간 제약·전파 지연·발진기 오차·TDC는 별도로 검증한다.


```c
#include <assert.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
int main(void) {
 const uint64_t clock_hz = 80000000ULL;
 const unsigned rates[] = {500000, 2000000};
 /* 설명용 범위. 실제 IP의 BRP/SEG/SJW 제약을 별도 적용한다. */
 for (size_t i = 0; i < 2; ++i)
  for (unsigned brp = 1; brp <= 16; ++brp)
   for (unsigned t1 = 2; t1 <= 31; ++t1)
    for (unsigned t2 = 1; t2 <= 8; ++t2) {
     unsigned total = 1 + t1 + t2;
     if (clock_hz != (uint64_t)rates[i] * brp * total) continue;
     /* 80% sample point인 후보만 출력한다. */
     if (5U * (1U + t1) == 4U * total)
      printf("rate=%u BRP=%u TSEG1=%u TSEG2=%u SP=80%%\n",
             rates[i], brp, t1, t2);
    }
 assert(clock_hz / (8 * 20) == 500000);
 assert(clock_hz / (2 * 20) == 2000000);
 return 0;
}
```


## 검증 순서와 장애 분류


① Classical 8바이트, Nominal만 검증 → ② FD, BRS=0 검증 → ③ FD, BRS=1로 Data phase 검증 → ④ 12·16·32·64바이트 payload와 버퍼 경계 검증 → ⑤ bus load·온도·전압·배선 조건 확장 순으로 진행한다. 단계별 설정값·레지스터 readback·분석기 로그·TEC/REC와 TDC 상태를 함께 남긴다.


| **증상**                      | **확인 및 대응**                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| **BRS=0도 실패**               | FD 모드·ISO/non-ISO·수신 노드 호환·메시지 버퍼 배치·Nominal 설정부터 확인한다.           |
| **BRS=0 정상, BRS=1 실패**      | 실제 f_CAN, Data 타이밍과 인코딩, TDC, 트랜시버 루프 지연 및 파형을 우선 확인한다.           |
| **8바이트 정상, 긴 payload에서 실패** | DLC 인코딩, MB payload 크기, stride, 수신 버퍼·상위 계층 길이, 오래된 데이터 패딩을 확인한다. |
| **전력 모드 전환 후 실패**           | 클록 소스·분주 변경 또는 정지 이후 CAN 타이밍 복구와 트랜시버 standby 해제를 확인한다.           |


## S32K312: Classical에서 FD/BRS로 변경하는 설정 절차


S32K312와 설치한 S32K3 RTD 버전의 FlexCAN 예제를 기준으로 진행한다. S32K1xx S32 SDK의 함수명·clock API·레지스터 설정을 혼용하지 않는다. 아래는 변경 항목을 찾는 절차이며 프로젝트의 클록·실제 트랜시버·RTD 버전이 확정되지 않아 그대로 실행 가능한 생성 코드나 검증 완료 레지스터 dump는 아니다.

- ① Classical 통신이 되는 설정을 보관하고 실제 FlexCAN 입력 클록을 기록한다. Nominal 500 kbit/s를 유지한다면 FD 활성화 후에도 Nominal 속도·Sample Point가 의도대로 유지되는지 재계산한다.
- ② 컨트롤러의 FD 지원 옵션과 ISO FD 조건을 확인한다. 사용할 인스턴스·드라이버 구성에서 허용하는 타이밍 경로를 선택하고 Nominal 및 Data 설정을 별도로 입력한다.
- ③ Data bitrate 2 Mbit/s, Sample Point 80% 등의 목표로 후보를 계산하되 BRP_N/BRP_D 관계와 각 세그먼트·SJW 범위를 RTD validation과 Reference Manual로 확인한다. 계산기가 다른 sample point를 선택하면 실제값과 오차를 기록한다.
- ④ FD payload 크기를 해당 메시지 버퍼 영역에 설정하고, 유효 MB 개수·offset·TX/RX buffer 크기를 다시 계산한다. Classical의 8바이트 복사 코드, DLC 해석과 고정 MB stride를 모두 점검한다.
- ⑤ TX 프레임에서 FD 프레임 형식(FDF/EDL)을 선택한다. 처음에는 BRS를 끄고 수신을 확인한 뒤 BRS를 켠다. 컨트롤러 FD 옵션과 프레임별 FD/BRS 옵션이 함께 일치해야 한다.
- ⑥ RTD가 제공하는 TDC 옵션과 인자를 확인한다. TDC offset의 단위가 CAN 클록 주기인지 Data TQ인지 반드시 확인하며, 드라이버가 값을 계산하는지 raw field를 받는지도 확인한다. 내부 delay 측정값·SSP 제약·TDC 실패 상태를 보드에서 확인한다.
- ⑦ 코드 생성 후 초기화 상태와 실제 타이밍 설정을 readback하고, 분석기의 500 kbit/s / 2 Mbit/s 및 FD/BRS 설정과 맞춘다. 전송 성공 callback만 보지 말고 분석기 수신·ACK·오류 카운터를 확인한다.

## S32K312: FD 변경 전후 체크리스트


| **항목**              | **Classical 기준** | **FD 전환 후 확인**          |
| ------------------- | ---------------- | ----------------------- |
| **Nominal bitrate** | 500 kbit/s 예시    | 같은 값 유지·재계산             |
| **Data bitrate**    | 사용하지 않음          | 2 Mbit/s 예시·실제값 확인      |
| **FD enable**       | Off              | On                      |
| **프레임 FDF/EDL**     | Classical        | FD                      |
| **BRS**             | 해당 없음            | Off 검증 후 On             |
| **payload 길이**      | 최대 8 bytes       | 12/16/20/24/32/48/64 검증 |
| **DLC**             | 0~8 길이와 동일       | 9~15 별도 길이 매핑           |
| **MB 메모리**          | Classical 크기     | payload 영역·수량·stride    |
| **TDC**             | Data phase 없음    | 실제 IP·드라이버 조건 확인        |
| **트랜시버**            | Nominal 속도 확인    | FD 속도·지연·파형 확인          |
| **상위 계층**           | 8바이트 가정 가능       | CanIf/CanTp/앱 길이 점검     |


80 MHz 계산 예제에서 Nominal은 BRP=8·20TQ로 500 kbit/s, Data는 BRP=2·20TQ로 2 Mbit/s다. 이것은 후보 계산 결과이며 S32K312용 드라이버의 허용 조합과 지연 조건을 통과했다는 의미는 아니다. 설정 도구가 prescaler/segment를 다른 값으로 표현하면 실제 물리값으로 환산해 비교한다.

## 이해를 확인하는 질문

> TDC를 켜면 잘못된 data timing도 보정될까?

TDC는 주로 송신 지연 보상을 위한 sampling 위치와 관련된다. 잘못된 bitrate·segment·전기적 조건을 대신 해결하지 않는다.
