---
layout: default
title: OSP
has_children: false
published_date: 2026-10-14-13-10-00
last_modified_date: 2026-10-14-13-10-00
nav_order: 12
parent: '차량 통신'
permalink: '/차량_통신/OSP'
redirect_from:
 - /3f91b412900a812baf18ec687a76bdfa
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


OSP(Open System Protocol)는 ams OSRAM의 RGB 조명·지능형 드라이버 노드를 daisy chain으로 제어하는 통신 프로토콜이다. LED 밝기 값을 쓰는 것뿐 아니라 노드 초기화·주소 할당·상태 조회·오류 처리까지 포함한다. SPI는 MCU 측 전송 수단으로 사용될 수 있지만 OSP 전체를 일반적인 CS/MOSI/MISO 방식의 SPI 장치로 취급해서는 안 된다.


## 적용 범위와 하드웨어 구분


이 문서는 OSRAM RGB 구동 경험과 관련한 학습 자료다. 실제 사용한 LED·보드·라이브러리가 확인되기 전이므로 특정 제품을 사용했다고 단정하지 않는다. 공개 구현의 대표 노드는 RGB가 내장된 OSIRE E3731i(RGBi), 외부 LED를 구동하는 AS1163(SAID)이다. 아래 제조사 예제는 OSP32/Arduino 기반이며 S32K312에 바로 빌드되는 코드는 아니다.


## 1. 시스템 구성과 계층


```text
애플리케이션: 색상·밝기·애니메이션·진단 정책
          ↓
OSP 명령: RESET / INIT / 상태 조회 / PWM 설정
          ↓
Telegram: 주소·명령·길이·payload·CRC
          ↓
MCU 전송 계층: 송신, 응답 수신, 방향 제어, timeout
          ↓
물리 인터페이스 → 첫 OSP 노드 → 다음 노드 → … → 마지막 노드
```



공개 aolibs는 aoosp가 telegram 생성·응답 해석을, aospi가 하드웨어 송수신을 담당하도록 분리한다. S32K312 포팅에서는 이 분리를 유지하여 검증된 telegram 로직과 CRC는 재사용하고 ESP32/Arduino 의존 전송·시간 측정·GPIO 부분을 별도로 구현한다.


## 2. BiDir와 Loop 응답 경로

- BiDir: 응답이 체인을 역방향으로 돌아와 첫 노드 쪽 MCU 인터페이스에 도착한다. 송신 후 MCU가 신호선을 계속 구동하면 노드의 응답과 충돌할 수 있다.
- Loop: 체인의 끝을 MCU 수신 경로에 연결하여 응답이 순방향으로 진행한 뒤 돌아오게 한다. 배선과 수신 입력 선택이 BiDir와 달라진다.

제조사 OSP32 보드는 송신용 SPI와 수신용 SPI, 방향 MUX와 buffer enable을 사용한다. 이것은 평가 보드 구현 예이며 모든 사용자 보드에 같은 MUX가 있다는 뜻은 아니다. 체인 종단·레벨 시프터·응답 경로는 실제 회로도를 기준으로 확인한다.


## 3. 일반 SPI와 다른 MCU 물리 모드


제조사 aospi 문서는 MCU mode type A를 1-wire Manchester, type B를 2-wire SPI로 구분한다. RGBi와 기본 OTP의 SAID는 type A 관련 조건을 확인해야 하며 OSP32의 첫 SAID는 type B에 맞게 구성되어 있다. type B 기본 예제를 RGBi 직접 연결에 그대로 적용하면 통신하지 않을 수 있다.

- type A: 클록과 데이터가 Manchester 신호에 실린다. 공개 구현은 telegram 비트를 인코딩하여 SPI로 파형을 생성한다. OSP 비트레이트와 파형 생성용 SPI SCK를 구분한다.
- type B: 송신 시 두 신호를 사용하며 공개 구현의 기준은 2.4 MHz, MSB first, SPI mode 0이다. telegram 내부의 바이트 사이에 불필요한 공백이 생기지 않도록 한다. 해당 칩 사양의 주파수 허용 오차를 따른다.
- 응답은 일반 SPI read의 dummy clock 방식으로만 생각하면 안 된다. 공개 보드에서는 OSP 노드가 응답 클록을 생성하고 MCU가 수신 측 역할을 한다. 수신 버퍼와 경로를 응답 시작 전에 준비해야 한다.
- 공개 aospi 문서에서 BiDir 수신은 mode 0, Loop 수신은 mode 3의 특성을 설명한다. 실제 드라이버는 초기화·idle 레벨·보드 배선을 함께 처리하므로 수신 설정 숫자 하나만 바꿔 포팅을 완료했다고 판단하지 않는다.

## 4. S32K312에서 클록과 전송 계층 설계


먼저 OSP 노드의 MCU mode와 보드의 송신/수신 경로를 확정한다. LPSPI로 type B 송신을 구현한다면 f_functional, prescaler, SCKDIV로 실제 SCK를 계산한다. type A라면 Manchester 비트 확장 방식과 출력 파형을 별도로 검증한다. 공개 aospi 구현은 type A에서 4.8 MHz, type B에서 2.4 MHz를 기준으로 설정한다.


```text
가정: LPSPI functional clock = 48 MHz
PRESCALE = 0 → 분주비 1

Type B 파형: SCKDIV = 18
48 MHz / (1 × (18 + 2)) = 2.4 MHz

Type A의 비트 확장 출력: SCKDIV = 8
48 MHz / (1 × (8 + 2)) = 4.8 MHz

48 MHz는 계산 가정이며 보드 기본 클록이 아니다.
Type A는 raw telegram을 그대로 보내는 대신 Manchester 인코딩이 필요하다.
```



보드의 클록 트리에서 48 MHz가 허용되는지 먼저 확인한다. DMA 또는 FIFO를 이용해 telegram 중간의 불필요한 gap을 방지하고, 물리 전송 완료를 확인한 뒤 output enable을 해제한다. MCU가 송신을 멈춘 시점과 주변장치 핀을 실제 high-impedance로 만든 시점은 다를 수 있다.


첫 단계에서는 송신과 응답 수신 기능을 독립적으로 검증한다. 외부 클록을 받는 수신용 LPSPI peripheral 설정, PCS 입력 처리, buffer enable, timeout timer를 설계한다. 하나의 SPI 블록을 동적으로 전환하는 구성은 방향 전환 지연과 핀 mux 시간을 포함해 측정해야 하며 충분한 시간 여유가 있다고 가정하지 않는다.


## 5. 첫 점등보다 먼저 확인할 RESET와 INIT


제조사 bring-up 절차는 먼저 RESET telegram이 다음 노드로 전달되는지 파형으로 확인한다. LED 점등에는 주소·상태·PWM·전류 설정이 모두 필요하므로 불이 켜지지 않는 것만으로 물리 통신 실패를 판단하면 원인 분리가 어렵다.


```text
제조사 공개 예제의 telegram:
RESET broadcast: A0 00 00 22
INITBIDIR, 시작 주소 1: A0 04 02 A9
INITLOOP, 시작 주소 1:  A0 04 03 86

공개 bring-up 예제는 RESET 후 150 us 대기한다.
실제 제품 사양의 reset 완료 시간과 인터페이스 복구 조건을 확인한다.
```



RESET 후 노드가 인터페이스 모드를 다시 판단할 수 있으므로 SIO.P/SIO.N의 pull 상태와 출력 buffer 해제 상태를 확인한다. 잘못된 idle/pull 조합으로 다른 모드가 선택되면 전원 재인가 전까지 통신이 되지 않는 상황이 생길 수 있다. 평가 보드의 특정 pull-up 실험 배선을 다른 회로에 그대로 적용하지 않는다.


## 6. 주소 할당에서 RGB 제어까지


```text
1. 전원·I/O 레벨·체인·종단 확인
2. MCU transport 및 응답 수신 경로 준비
3. RESET → 규정된 대기
4. 배선에 맞춰 INITBIDIR 또는 INITLOOP
5. 마지막 주소·응답 CRC·상태로 탐색 결과 확인
6. 오류 원인을 확인하고 필요한 초기 상태 처리
7. 장치별 허용 전류·PWM 설정과 ACTIVE 상태 전환
8. 첫 노드 한 채널을 낮은 밝기로 점등
9. R/G/B 단색 → 여러 노드 → 동기 갱신 순으로 확장
```



주소 할당 결과가 예상 노드 수와 일치하는지 확인한다. 임의 노드 번호를 고정해 두고 PWM부터 보내면 재배선·체인 단선 시 다른 LED를 제어할 수 있다. 노드 종류에 따라 PWM 명령이 다르므로 RGBi용 setpwm과 SAID 채널용 setpwmchn을 구분한다.


제조사 aoosp_min 예제는 RESET·INIT 후 CLRERROR·GOACTIVE와 SAID 채널 PWM 설정을 수행한다. 실제 적용에서는 오류 원인을 확인하지 않고 반복해서 clear하지 않으며, 반환 상태가 실패하면 다음 단계로 진행하지 않는다.


```c++
// Arduino aoosp API 사용 예: transport 초기화와 주소 할당이 끝난 상태
// node 1이 SAID이고 channel 0에 RGB가 연결되었을 때만 적용한다.
// 각 호출 결과를 aoresult API로 검사한 뒤 다음 호출로 진행한다.
aoosp_send_setpwmchn(0x001, 0, 0x0800, 0x0000, 0x0000); // 낮은 R
// 충분한 관찰 시간 후
aoosp_send_setpwmchn(0x001, 0, 0x0000, 0x0800, 0x0000); // 낮은 G
// 충분한 관찰 시간 후
aoosp_send_setpwmchn(0x001, 0, 0x0000, 0x0000, 0x0800); // 낮은 B
// 소등
aoosp_send_setpwmchn(0x001, 0, 0x0000, 0x0000, 0x0000);
```



이 코드는 호출 형태를 보여주는 조각이며 전체 펌웨어가 아니다. 제품별 PWM 범위·허용 전류·상태 전환 조건을 확인한다. 색상 보정·온도 보상·휘도 매핑은 통신 성공과 별개의 단계다. 동일한 R/G/B 수치가 시각적으로 동일한 밝기 또는 정확한 백색을 보장하지 않는다.


## 7. CRC를 PC에서 먼저 검증하기


공개 aoosp_crc 구현은 CRC-8 다항식 0x2F, 초기값 0, MSB-first, 최종 XOR 0에 해당한다. 아래 독립 구현은 공개 RESET·INIT telegram의 CRC와 대조한다. payload 또는 헤더를 바꾸면 CRC도 다시 계산해야 한다.


```python
def osp_crc(data):
    crc = 0
    for byte in data:
        crc ^= byte
        for _ in range(8):
            crc = ((crc << 1) ^ (0x2F if crc & 0x80 else 0)) & 0xFF
    return crc

assert osp_crc(bytes.fromhex("A0 00 00")) == 0x22
assert osp_crc(bytes.fromhex("A0 04 02")) == 0xA9
assert osp_crc(bytes.fromhex("A0 04 03")) == 0x86

def valid_crc(frame):
    return len(frame) >= 4 and osp_crc(frame[:-1]) == frame[-1]

assert valid_crc(bytes.fromhex("A0 00 00 22"))
assert not valid_crc(bytes.fromhex("A0 00 01 22"))
print("OSP CRC vectors passed")
```



CRC 일치만으로 응답이 올바른 것은 아니다. 최소 길이, preamble·길이 필드, 예상 command·주소·payload 길이, 수신 timeout도 검증한다. broadcast 명령에 항상 응답이 온다고 가정하지 말고 각 명령의 응답 유무를 명세에 따라 처리한다.


## 8. 타이밍과 동기 갱신


제조사 aospi 공개 구현은 telegram 간 idle 기본값으로 8 us를 사용한다. 이 값과 RESET의 150 us 대기, 노드 전달 시간, 응답 완료 timeout은 서로 다른 시간이다. 바이트 수×8/SCK만으로 체인 전체 응답 timeout을 결정하지 말고 hop 지연과 노드 처리 시간을 포함한다.


노드별 PWM을 순서대로 즉시 적용하면 긴 체인에서 갱신 시차가 보일 수 있다. 장치가 지원하는 SYNC 기능을 설정하고 PWM 값을 준비한 뒤 동기 명령으로 적용하는 흐름을 검토한다. 지원 여부·설정 비트·하드웨어 SYNC 조건은 노드별로 다르다. 단순 통신 학습에 비가역적인 OTP 설정 변경은 필요하지 않다.


## 9. 증상별 디버깅

- RESET이 다음 노드로 전달되지 않음: MCU mode A/B, I/O 전압·pull, 출력 enable, 인코딩과 SCK, telegram gap·CRC를 확인한다.
- 송신은 보이나 응답 없음: BiDir/Loop 배선, 수신 MUX·입력 mode, 수신 준비 시점, 노드가 응답을 생성하는 명령인지 확인한다. 임의의 dummy clock 추가로 해결하려 하지 않는다.
- INIT 응답의 마지막 주소가 예상보다 작음: 노드별 전달 파형과 전원을 따라가며 체인 단절·방향·부품 모드 차이를 확인한다.
- 응답은 정상인데 LED가 꺼짐: ACTIVE/SLEEP 상태, trap된 오류, 채널 번호·전류·PWM 값, 실제 RGB 배선과 노드 종류를 확인한다.
- 첫 노드는 정상이고 긴 체인에서 실패: hop에 따른 timeout, 전원 강하, 신호 품질, 노드 버전별 명령·payload 지원 차이를 확인한다. 공개 예제에는 구형 OSP 노드가 PSI=5 telegram을 전달하지 않는 사례도 있다.

## 10. 실습 결과 기록


사용 MCU·RTD 버전, RGB/SAID 부품명과 보드 revision, OSP 라이브러리 commit, type A/B와 BiDir/Loop 구성, 노드 수, 클록·idle·timeout, 송수신 hex와 CRC 결과, 주소 할당·단색 점등·오류 복구 결과를 기록한다. 실제 사용 부품과 프로젝트 버전이 확정되면 이 항목에 측정값과 재현 순서를 추가한다.


구현 구분은 제조사 공개 프로젝트 OSP_aotop, OSP_aospi의 물리 계층·bring-up 설명, OSP_aoosp의 aoosp_min 및 CRC 구현을 기준으로 했다. 이 문서의 S32K312 포팅 항목과 계산 예제는 설계·학습용이며 보드에서 구동 검증한 결과를 의미하지 않는다.

