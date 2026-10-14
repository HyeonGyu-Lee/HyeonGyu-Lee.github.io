---
layout: default
title: UART
has_children: false
published_date: 2026-10-14-15-10-00
last_modified_date: 2026-10-14-15-10-00
nav_order: 13
parent: '차량 통신'
permalink: '/차량_통신/UART'
redirect_from:
 - /3f91b412900a81af8221d49c3dd33cae
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


UART는 별도 클록선 없이 약속한 baudrate·data bits·parity·stop bits로 데이터를 주고받는 비동기 직렬 통신이다. 프레임 경계를 애플리케이션이 정의해야 하며, UART 전기 레벨과 RS-232/RS-485 물리 계층을 구분한다.


## S32K312 LPUART 설정 순서

- 회로도와 패키지에서 사용할 LPUART 인스턴스·TX/RX pin mux·입력 경로를 확인한다. TX↔RX와 공통 GND를 연결하고 USB-UART 전압을 맞춘다. RS-232 전압 신호를 MCU 핀에 직접 연결하지 않는다.
- 실제 LPUART functional clock을 확인한다. 설치 RTD의 Lpuart_Uart IP 또는 해당 프로젝트 UART 드라이버 예제를 기준으로 초기화한다. S32K1 SDK API를 이름만 바꾸어 사용하지 않는다.
- 초기 값은 상대 장치와 합의한 115200, 8 data bits, no parity, 1 stop bit(8N1) 등으로 맞춘다. hardware flow control 지원·배선이 없으면 RTS/CTS를 임의 활성화하지 않는다.
- 처음에는 짧은 polling TX와 고정 길이 RX를 검증한다. 이후 IRQ·DMA·ring buffer·parser를 추가한다. timeout 단위와 nonblocking API의 완료 조건을 확인한다.

## baudrate 계산과 오차


```text
일반적인 LPUART 계산 모델:
baud_actual = f_functional / (OSR_actual × SBR)
OSR_actual = OSR_field + 1인 구현은 필드값과 실제값을 구분
오차[%] = 100 × (baud_actual - baud_target) / baud_target

가정: f_functional = 80 MHz, OSR_actual=16, SBR=43
baud_actual ≈ 116279.07 bit/s
115200 대비 오차 ≈ +0.937%

이 후보가 최적 또는 해당 보드에서 검증된 설정이라는 뜻은 아니다.
다른 OSR/SBR 조합과 해당 IP의 허용 범위를 함께 탐색한다.
```



낮은 OSR에서 추가 sampling 옵션이 필요한지 매뉴얼을 확인한다. 허용 오차는 송수신 양쪽의 발진기 오차·프레임 길이·sampling 방식·온도 조건을 합쳐 평가한다. 통신 한 번 성공했다고 전 범위에서 안정적이라고 판단하지 않는다. 8N1은 payload 1바이트당 일반적으로 10비트 시간을 사용하므로 115200에서 이론상 약 11520 bytes/s다.


## 수신 buffer와 메시지 framing


UART는 byte stream이다. RX callback 한 번이 애플리케이션 메시지 하나와 일치한다고 가정하지 않는다. ISR/DMA 완료에서 bytes를 ring buffer에 넣고 task에서 parser를 실행한다. buffer full 정책과 overrun 카운터를 정의한다. producer/consumer 공유 인덱스에는 플랫폼에 맞는 원자성·동기화가 필요하다.


```python
# 학습용 줄 단위 parser: 실제 펌웨어가 아니라 PC 테스트 예제
class LineParser:
    def __init__(self, limit=64):
        self.buf = bytearray()
        self.limit = limit
        self.dropping = False

    def feed(self, chunk):
        lines = []
        for value in chunk:
            if value == 10:  # LF
                if not self.dropping:
                    lines.append(bytes(self.buf).rstrip(b"\r"))
                self.buf.clear()
                self.dropping = False
            elif not self.dropping:
                if len(self.buf) >= self.limit:
                    self.buf.clear()
                    self.dropping = True  # 다음 LF까지 폐기하여 재동기화
                else:
                    self.buf.append(value)
        return lines

p = LineParser()
assert p.feed(b"PI") == []
assert p.feed(b"NG\r\nOK\n") == [b"PING", b"OK"]
p = LineParser(3)
assert p.feed(b"TOOLONG\nOK\n") == [b"OK"]
```



## 바이너리 프로토콜 설계


바이너리 데이터는 SOF·길이·명령·sequence·payload·CRC 등으로 계약을 정의한다. 길이 상한·partial frame timeout·CRC 실패 후 재동기화를 구현한다. SOF가 payload에 들어갈 수 있다면 escape 또는 COBS 같은 framing을 선택한다. UART parity는 프레임 CRC나 애플리케이션 ACK를 대체하지 않는다.


## 송신 완료와 RS-485


TX buffer 수명이 완료까지 유지되어야 한다. DMA 완료나 TX FIFO empty와 마지막 stop bit 전송 완료는 다를 수 있다. RS-485의 DE를 내릴 때는 실제 transmission complete 조건을 확인한다. 반이중 방향 전환·응답 대기·버스 bias·종단은 사용 트랜시버와 네트워크 설계에 따른다.


## 오류 처리와 검증

- 깨진 문자: baudrate·data bits·parity·stop bits·전압·GND를 확인한다. 보이는 문자가 없으면 TX 파형과 RX input mux를 따로 점검한다.
- 연속 수신에서 누락: overrun·ISR 지연·ring buffer 크기·DMA 재설정 공백을 확인한다. callback에서 printf나 blocking 송신을 하지 않는다.
- framing/parity/noise/overrun flag를 구분해 기록하고 설치 드라이버의 flag clear·재수신 절차를 따른다.
- 내부/외부 loopback → PC terminal → 분할·연속 메시지 → 최대 길이·overflow·timeout·잘못된 CRC → 장시간 부하 순으로 검증한다. terminal의 local echo와 개행 자동 변환은 끄거나 명확히 설정한다.
