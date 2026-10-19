---
layout: default
title: MCAL & I-O
has_children: true
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 4
parent: 'AUTOSAR Configuration'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/MCAL_&_I-O'
redirect_from:
 - "/3f91b412900a819383d5fff13039a421"
---
## application 기능과 hardware 자원을 모듈별로 나누는 상황


Peripheral driver는 MCU 자원을 설정·제어하고 상위 software는 신호와 기능의 의미를 다룬다. Channel, pin과 clock의 hardware 제약은 ECU별 configuration에 반영된다.


## MCAL & I-O의 구성


> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.


| 모듈   | 역할                                                                                            |
| ---- | --------------------------------------------------------------------------------------------- |
| Adc  | Analog 입력을 digital 값으로 변환하는 ADC peripheral driver. Channel과 group 같은 hardware 가까운 구성을 다룬다.    |
| Cdd  | Complex Device Driver 영역. 표준 driver/interface만으로 표현하기 어려운 장치·timing 요구를 통합하는 구성이다.            |
| Dio  | Digital input/output의 channel·port 접근을 제공하는 MCAL driver. Pin 기능 선택을 다루는 Port driver와 구분한다.    |
| Gpt  | General Purpose Timer driver. Timer channel의 시작·정지·시간 관련 hardware 접근을 제공한다.                   |
| Icu  | Input Capture Unit driver. Edge·timestamp·signal measurement 등 입력 시간 정보를 다루는 peripheral 추상화다. |
| Mcu  | MCU의 clock·reset·power mode 등 공통 hardware 기능에 대한 MCAL driver다.                                |
| Ocu  | Output Compare Unit driver. Timer compare 기반 output 동작의 hardware 추상화를 제공한다.                   |
| Port | Pin/port의 기능·방향 등 초기 구성을 담당하는 driver. Digital 값을 읽고 쓰는 Dio와 구분한다.                             |
| Pwm  | PWM peripheral의 period·duty 등 output 특성을 추상화하는 driver다.                                       |
| Spi  | SPI hardware와 channel/job/sequence 등의 통신 구성을 다루는 MCAL driver다.                                |


## 표준 범위


이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.


## 이해를 확인하는 질문


> 같은 그룹의 모듈을 하나의 책임으로 합쳐도 될까?


그룹은 탐색을 위한 분류다. 실제 API·configuration·state의 경계는 개별 module이 정의하므로 각 책임과 연결을 따로 확인한다.

