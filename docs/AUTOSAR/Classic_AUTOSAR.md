---
layout: default
title: Classic AUTOSAR
has_children: true
published_date: 2024-06-03-08-06-00
last_modified_date: 2026-10-12-14-10-00
nav_order: 1
parent: 'AUTOSAR'
permalink: '/AUTOSAR/Classic_AUTOSAR'
redirect_from:
 - /60a1016be7be4a4082033eabd928f106
 - /undefined
---
## 핵심 요약


Classic AUTOSAR의 계층, 모듈과 설정을 학습하기 위한 진입 문서다.


## 적용 범위


정확한 규범적 요구사항은 적용 AUTOSAR 릴리스를 지정한 뒤 확인한다.


## 본문


---


# Classic AUTOSAR의 구조


> Classic AUTOSAR는 Layered Architecture로 구성되어 있으며, 주요 계층은 Application Layer, Runtime Environment (RTE), Basic Software (BSW), 그리고 Microcontroller로 나눌 수 있습니다. 각 계층은 특정한 역할과 기능을 가지고 있으며, 서로 독립적으로 동작할 수 있도록 설계되어 있습니다.


<div class="canvas-container"><canvas id="autosarCanvas"></canvas></div>


---


## Application Layer `Application`


> Application Layer는 차량의 전자 제어 장치(ECU)의 특정 기능 구현을 담당합니다. 엔진 제어, 변속기 제어, 차량 동역학 등의 특정 작업을 실행하기 위해 하위 계층과 상호작용하는 다양한 응용 소프트웨어 구성 요소가 포함됩니다


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
Application Layer에는 **ASW(Application Software)**로 구성되어 있다.<br>ASW는 **SW-C(Software Component)**의 집합으로 구성되어 있다.
</div>
</div>
</blockquote>



---


## AUTOSAR Runtime Environment `RTE`


> <span class="tooltip">RTE<span class="tooltiptext">Runtime Environment</span></span>는 <span class="tooltip">ASW<span class="tooltiptext">Application Software</span></span>와 <span class="tooltip">BSW<span class="tooltiptext">Basic Software</span></span> 모듈 간의 통신을 용이하게 하는 미들웨어 계층입니다. 구성 요소가 ECU 내의 위치에 관계없이 서로 상호작용할 수 있도록 합니다.


---


## Basic Software `BSW`


> <span class="tooltip">BSW<span class="tooltiptext">Basic Software</span></span> 계층은 <span class="tooltip">ASW<span class="tooltiptext">Application Software</span></span>와 <span class="tooltip">RTE<span class="tooltiptext">Runtime Environment</span></span>에 필요한 필수 서비스와 기능을 제공합니다. 각기 다른 소프트웨어 인프라의 다양한 측면을 담당하는 여러 하위 계층으로 나뉩니다.


### Services Layer


> 서비스 계층은 ASW 및 다른 BSW 모듈에 다양한 시스템 서비스를 제공합니다. 각기 특정 서비스를 제공하는 여러 하위 모듈로 구성됩니다.


#### System Services


> 시스템 서비스는 진단 서비스, 시간 관리, ECU 상태 관리와 같은 일반 목적의 기능을 제공합니다.


| 모듈                                    | 기능 및 특징                                             |
| ------------------------------------- | --------------------------------------------------- |
| Development Error Tracer (DET)        | • 개발 단계에서 발생하는 오류를 감지하고 보고<br>- 오류 로그 기록, 디버깅 지원    |
| Communication Manager (ComM)          | • ECU의 통신 모드 관리<br>- 네트워크 활성화/비활성화 관리, 통신 모드 전      |
| Watchdog Manager (WdgM)               | • 시스템의 시간적 오류 감지 및 대응<br>- Watchdog 타이머 관리, 시스템 리셋  |
| Function Inhibition Manager (FIM)     | • 특정 기능의 실행 억제 또는 제한<br>- 시스템 상태에 따른 기능 활성화/비활성화 관리 |
| Time Services (TM)                    | • 시스템 내 시간 관리<br>- 타이머 설정 및 관리, 시간 동기화              |
| BSW Manager (BswM)                    | • BSW 모듈 간 상호작용 관리<br>- 시스템 모드 전환 제어, 이벤트 처리        |
| Synchronized Time-Base Manager (StbM) | • ECU 간 시간 동기화<br>- 정밀한 시간 기준 제공                    |
| Diagnostic Event Manager (DEM)        | • 진단 이벤트 관리<br>- 오류 코드 기록, 진단 데이터 수집/저장             |
| ECU States Manager (EcuM)             | • ECU 상태 전환 관리<br>- 전원 상태, 초기화, 셧다운 제어              |
| AUTOSAR OS                            | • 실시간 운영체제 기능 제공<br>- Task 및 자원 관리, 실시간 스케줄링        |


#### Memory Services


> 메모리 서비스는 휘발성 및 비휘발성 메모리의 관리 및 접근을 처리합니다.


| 모듈                   | 기능 및 특징                                  |
| -------------------- | ---------------------------------------- |
| NV RAM Manager (NvM) | • 비휘발성 메모리 관리<br>- 데이터 저장/복구, 데이터 무결성 검증 |


#### Crypto Services


> 암호화 서비스는 보안 통신을 위한 암호화 및 해독 기능을 제공합니다.


| 모듈                            | 기능 및 특징                             |
| ----------------------------- | ----------------------------------- |
| Crypto Services Manager (CSM) | • 암호화 서비스 관리<br>- 키 관리, 데이터 암호화/복호화 |


#### Off-board Communication Services


> 외부 통신 서비스는 외부 장치와의 통신을 지원합니다.


| 모듈                                                   | 기능 및 특징                                   |
| ---------------------------------------------------- | ----------------------------------------- |
| Xcp (Universal Measurement and Calibration Protocol) | • 측정 및 캘리브레이션 지원<br>- 데이터 수집, ECU 매개변수 조정 |
| Socket Adapter                                       | • 소켓 인터페이스 제공<br>- TCP/IP 통신 지원           |
| Diagnostic Com. Manager (DCM)                        | • 진단 통신 관리<br>- 진단 요청 처리, UDS 지원          |
| Diagnostic Log and Trace (DLT)                       | • 진단 로그 및 추적<br>- 로그 데이터 수집/저장, 디버깅 지원    |
| DoIP (Diagnostics over IP)                           | • IP 기반 진단 데이터 전송<br>- 네트워크 진단 지원         |
| TCP/IP Com. Services                                 | • TCP/IP 통신 관리<br>- 네트워크 연결 및 데이터 전송 관리   |
| Service Discovery                                    | • 네트워크 서비스 검색<br>- 서비스 제공자/클라이언트 자동 연결    |
| Secure Onboard Com                                   | • 통신 보안 기능 제공<br>- 데이터 암호화/복호화, 인증 관리     |


#### Communication Services


> 통신 서비스는 차량 내부 네트워크 통신을 관리합니다.


| 모듈                                                                                         | 기능                                                  |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| SomeIPXf (SOME/IP Transformer)                                                             | • 서비스 지향 아키텍처 통신 지원<br>- SOME/IP 메시지 처리             |
| ComXf (Communication Transformer)                                                          | • 통신 데이터 변환<br>- 프로토콜 간 데이터 변환                      |
| E2EXf (End-to-End Transformer)                                                             | • 종단 간 데이터 보호<br>- 데이터 무결성 검증                       |
| IpduM (IPDU Multiplexer)                                                                   | • IPDU 다중화<br>- 데이터 전송 효율성 증가                       |
| LdCom (Local Diagnostic Communication)                                                     | • 로컬 진단 통신 지원<br>- ECU 간 진단 데이터 송수신                 |
| AUTOSAR COM                                                                                | • 신호 및 PDU 관리<br>- 통신 스택 상위 계층 지원                   |
| <span class="tooltip">PDU<span class="tooltiptext">Protocol Data Unit</span></span> Router | • PDU 라우팅<br>- 프로토콜 간 데이터 전송 관리                     |
| J1939 TP (Transport Protocol)                                                              | • J1939 네트워크 대용량 데이터 전송<br>- 데이터 분할/재조립             |
| LIN TP (Transport Protocol)                                                                | • LIN 네트워크 대용량 데이터 전송<br>- 데이터 분할/재조립               |
| CAN TP (Transport Protocol)                                                                | • CAN 네트워크 대용량 데이터 전송<br>- 데이터 분할/재조립               |
| FR TP (Transport Protocol)                                                                 | • FlexRay 네트워크 대용량 데이터 전송<br>- 데이터 분할/재조립           |
| XxxTSyn                                                                                    | • 통신 동기화 지원<br>- 다양한 동기화 방식 지원 (모듈에 따라 다름)          |
| Generic NM Interface                                                                       | • 네트워크 관리 모듈 인터페이스 제공<br>- 공통 인터페이스로 다양한 네트워크 관리 지원 |
| Flexray NM (Network Manager)                                                               | • FlexRay 네트워크 관리<br>- 네트워크 상태 모니터링                 |
| CAN NM (Network Manager)                                                                   | • CAN 네트워크 관리<br>- 네트워크 상태 모니터링                     |
| LIN NM (Network Manager)                                                                   | • LIN 네트워크 관리<br>- 네트워크 상태 모니터링                     |
| J1939 NM (Network Manager)                                                                 | • J1939 네트워크 관리<br>- 네트워크 상태 모니터링                   |
| UDP NM (Network Manager)                                                                   | • UDP 네트워크 관리<br>- 네트워크 상태 모니터링                     |
| CAN SM (State Manager)                                                                     | • CAN 네트워크 상태 관리<br>- 상태 전환 제어                      |
| LIN SM  (State Manager)                                                                    | • LIN 네트워크 상태 관리<br>- 상태 전환 제어                      |
| FR SM  (State Manager)                                                                     | • FlexRay 네트워크 상태 관리<br>- 상태 전환 제어                  |
| ETH SM  (State Manager)                                                                    | • Ethernet 네트워크 상태 관리<br>- 상태 전환 제어                 |


---


### ECU Abstraction Layer


> ECU 추상화 계층은 하드웨어 종속성을 줄이고 상위 소프트웨어 계층에 표준화된 인터페이스를 제공하는 역할을 합니다.


#### On-board Device Abstraction


> 온보드 장치 추상화는 차량 내의 다양한 장치와의 인터페이스를 관리합니다.


| 모듈                         | 기능 및 특징                                             |
| -------------------------- | --------------------------------------------------- |
| Watchdog Interface (WdgIf) | • Watchdog 타이머 인터페이스 제공<br>- 다양한 Watchdog 타이머 지원    |
| External Watchdogs Driver  | • 외부 Watchdogs 타이머 제어<br>- 외부 Watchdogs 타이머와의 인터페이스 |


#### Memory Hardware Abstraction


> 메모리 하드웨어 추상화는 메모리 장치와의 통신을 관리합니다.


| 모듈                                   | 기능 및 특징                                                |
| ------------------------------------ | ------------------------------------------------------ |
| Memory Abstraction Interface (MemIf) | • 메모리 접근 추상화<br>- 다양한 메모리 타입 지원                        |
| EEPROM Abstraction (Ea)              | • EEPROM 접근 추상화<br>- EEPROM 데이터 관리                     |
| Flash EEPROM Emulation (Fee)         | • Flash 메모리의 EEPROM 에뮬레이션<br>- Flash 메모리의 EEPROM 기능 제공 |
| External EEPROM Driver               | • 외부 EEPROM 제어<br>- 외부 EEPROM 인터페이스                    |
| External Flash Driver                | • 외부 Flash 메모리 제어<br>- 외부 Flash 메모리 인터페이스              |


#### Crypto Hardware Abstraction


> 암호화 하드웨어 추상화는 암호화 장치와의 상호작용을 처리합니다.


| 모듈               | 기능 및 특징                                |
| ---------------- | -------------------------------------- |
| Crypto Interface | • 암호화 기능 인터페이스 제공<br>- 데이터 암호화/복호화 지원  |
| Crypto (SW)      | • 소프트웨어 암호화 기능 제공<br>- 다양한 암호화 알고리즘 제공 |


#### Wireless Communication Abstraction


> 무선 통신 추상화는 무선 통신 장치와의 인터페이스를 관리합니다.


| 모듈                                             | 기능 및 특징                                        |
| ---------------------------------------------- | ---------------------------------------------- |
| Bluetooth Interface (BT IF)                    | • Bluetooth 통신 인터페이스 제공<br>- Bluetooth 프로파일 관리 |
| Wi-Fi Interface (Wi-Fi IF)                     | • Wi-Fi 통신 인터페이스 제공<br>- Wi-Fi 네트워크 관리         |
| Cellular Communication Interface (Cellular IF) | • 셀룰러 통신 인터페이스 제공<br>- 셀룰러 네트워크 관리             |
| Near Field Communication Interface (NFC IF)    | • NFC 통신 인터페이스 제공<br>- 근거리 무선 통신 지원            |
| GNSS Interface (GNSS IF)                       | • GNSS 위치 정보 수신<br>- GPS 등 다양한 GNSS 지원         |
| V2X Communication Interface (V2X IF)           | • 차량 간 및 차량-인프라 간 통신<br>- V2X 프로토콜 지원          |


#### Communication Abstraction


> 통신 하드웨어 추상화는 통신 장치와의 인터페이스를 처리합니다.


| 모듈                                            | 기능 및 특징                                       |
| --------------------------------------------- | --------------------------------------------- |
| LIN Interface                                 | • LIN 통신 인터페이스<br>- LIN 프레임 송수신               |
| TT CAN IF (Time-Triggered CAN Interface)      | • 시간 트리거 방식의 CAN 인터페이스<br>- 시간 동기화 기반 통신      |
| CAN Interface                                 | • CAN 통신 인터페이스<br>- CAN 프레임 송수신               |
| CAN Trcv Driver (CAN Transceiver Driver)      | • CAN 트랜시버 제어<br>- 물리적 CAN 통신 제어              |
| Ext. CAN Driver (External CAN Driver)         | • 외부 CAN 통신 제어<br>- 보조 CAN 네트워크 인터페이스         |
| FR Interface                                  | • FlexRay 통신 인터페이스<br>- FlexRay 프레임 송수신       |
| FR Trcv Driver (FlexRay Transceiver Driver)   | • FlexRay 트랜시버 제어<br>- 물리적 FlexRay 통신 제어      |
| Ext. FR Driver (External FlexRay Driver)      | • 외부 FlexRay 통신 제어<br>- 보조 FlexRay 네트워크 인터페이스 |
| ETH Interface                                 | • Ethernet 통신 인터페이스<br>- Ethernet 프레임 송수신     |
| ETH Switch Driver                             | • Ethernet 스위치 제어<br>- 네트워크 스위칭 기능 제공         |
| ETH Trcv Driver (Ethernet Transceiver Driver) | • Ethernet 트랜시버 제어<br>- 물리적 Ethernet 통신 제어    |


#### I/O Hardware Abstraction


> 입출력 하드웨어 추상화는 다양한 입출력 장치와의 상호작용을 관리합니다.


| 모듈                       | 기능 및 특징                                 |
| ------------------------ | --------------------------------------- |
| I/O Signal Interface     | • I/O 신호 인터페이스 제공<br>- 디지털 및 아날로그 신호 관리 |
| Driver for ext. ADC ASIC | • 외부 ADC ASIC 제어<br>- 아날로그 신호 디지털 변환    |
| Driver for ext. I/O ASIC | • 외부 I/O ASIC 제어<br>- 다양한 I/O 신호 관리     |


---


### Microcontroller Abstraction Layer


> 마이크로컨트롤러 추상화 계층은 마이크로컨트롤러와 상호작용하는 드라이버를 제공합니다.


#### Microcontroller Drivers


> 마이크로컨트롤러 드라이버는 마이크로컨트롤러와의 직접적인 통신을 관리합니다.


| 모듈                    | 기능 및 특징                            |
| --------------------- | ---------------------------------- |
| Core Test (CorTst)    | • 코어 테스트 기능 제공<br>- 시스템 진단 및 검증    |
| Watchdog Driver (Wdg) | • 감시 타이머 제어<br>- 시스템 오류 감지 및 복구    |
| GPT Driver (GPT)      | • 범용 타이머 제어<br>- 타이머 설정 및 관리       |
| MCU Driver (MCU)      | • 마이크로컨트롤러 제어<br>- MCU 초기화 및 전원 관리 |


#### Memory Drivers


> 메모리 드라이버는 메모리 장치와의 통신을 처리합니다.


| 모듈                           | 기능 및 특징                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Internal Flash Driver (Fls)  | • 내장 Flash 메모리의 제어 및 관리<br>- Flash 메모리 읽기/쓰기, 지우기, 보호, 에러 검출 및 처             |
| Internal EEPROM Driver (Eep) | • 내장 EEPROM 메모리의 제어 및 관리<br>- EEPROM 읽기/쓰기, 데이터 무결성 보장, 웨어 레벨 지원, 에러 검출 및 처리 |
| RAM Test (RamTst)            | • 내장 RAM 메모리 테스트 기능 제공<br>- 다양한 RAM 테스트 알고리즘 사용                              |
| Flash Test (FlsTst)          | • 내장 Flash 메모리 테스트 기능 제공<br>- Flash 메모리의 읽기/쓰기 및 지우기 테스트                     |


#### Crypto Drivers


> 암호화 드라이버는 암호화 장치와의 통신을 처리합니다.


| 모듈     | 기능 및 특징                                      |
| ------ | -------------------------------------------- |
| Crypto | • 암호화 기능 제공<br>- 데이터 암호화/복호화 연산, 암호화 알고리즘 지원 |


#### Wireless Communication Drivers


> 무선 통신 드라이버는 무선 통신 장치와의 인터페이스를 관리합니다.


| 모듈               | 기능 및 특징                                  |
| ---------------- | ---------------------------------------- |
| Bluetooth Driver | • Bluetooth 통신 제어<br>- Bluetooth 데이터 송수신 |
| Wi-Fi Driver     | • Wi-Fi 통신 제어<br>- Wi-Fi 네트워크 연결         |
| Cellular Driver  | • 셀룰러 통신 제어<br>- 셀룰러 데이터 송수신             |
| NFC Driver       | • NFC 통신 제어<br>- 근거리 무선 데이터 송수신          |


#### Communication Drivers


> 통신 드라이버는 통신 장치와의 상호작용을 관리합니다.


| 모듈               | 기능 및 특징                                   |
| ---------------- | ----------------------------------------- |
| ETH Driver (Eth) | • Ethernet 통신 제어<br>- Ethernet 데이터 송수신    |
| FR Driver (Fr)   | • FlexRay 통신 제어<br>- FlexRay 데이터 송수신      |
| CAN Driver (Can) | • CAN 통신 제어<br>- CAN 데이터 송수신              |
| LIN Driver (Lin) | • LIN 통신 제어<br>- LIN 데이터 송수신              |
| LIN Comm. Stack  | • LIN 통신 스택 제공<br>- LIN 데이터 송수신 및 프로토콜 관리 |
| SPI Driver (Spi) | • SPI 통신 제어<br>- 동기식 직렬 데이터 송수신           |


#### I/O Drivers


> 입출력 드라이버는 다양한 입출력 장치와의 통신을 관리합니다.


| 모듈                 | 기능 및 징                                |
| ------------------ | ------------------------------------- |
| OCU Driver (Ocu)   | • 출력 비교 장치 제어<br>- PWM 및 타이머 출력 관리    |
| PORT Driver (Port) | • 포트 제어<br>- GPIO 설정 및 관리             |
| DIO Driver (Dio)   | • 디지털 I/O 제어<br>- 디지털 신호 읽기/쓰기        |
| ADC Driver (Adc)   | • 아날로그-디지털 변환기 제어<br>- 아날로그 신호 디지털 변환 |
| ICU Driver (Icu)   | • 입력 캡처 장치 제어<br>- 입력 신호 타이밍 측정       |
| PWM Driver (Pwm)   | • PWM 신호 생성<br>- PWM 출력 제어            |


---


### Complex Drivers


> <span class="tooltip">CDD<span class="tooltiptext">Complex Device Driver</span></span>는 ECU 추상화 계층을 통해 제공되지 않는 특정 하드웨어 기능을 직접 접근하는 드라이버입니다.


| 모듈                   | 기능 및 특징                                |
| -------------------- | -------------------------------------- |
| CddOvTp              | • 사용자 정의 전송 프로토콜<br>- 맞춤형 데이터 전송 관리    |
| CddOsOh              | • 사용자 정의 운영체제 오버헤드 관리<br>- OS 오버헤드 최적화 |
| CddOsPh              | • 사용자 정의 운영체제 페이로드 관리<br>- OS 페이로드 최적화 |
| SwUpdM               | • 소프트웨어 업데이트 관리<br>- 업데이트 다운로드 및 설치    |
| vMemAccM             | • 가상 메모리 접근 관리<br>- 메모리 접근 제어          |
| vMem                 | • 가상 메모리 관리<br>- 가상 메모리 매핑             |
| Idsm                 | • ID 및 보안 관리<br>- 사용자 인증 및 권한 관리       |
| CddRouter            | • 사용자 정의 데이터 라우팅<br>- 맞춤형 데이터 경로 설정    |
| OsekNM               | • OSEK 네트워크 관리<br>- 네트워크 상태 모니터링       |
| Power Manager (Pm)   | • 전원 관리<br>- 전원 상태 전환                  |
| UART                 | • UART 통신 관리<br>- 직렬 데이터 송수신           |
| …                    |                                        |
| CoreService (CoSvAb) | • 코어 서비스 제공<br>- 시스템 기본 서비스 지원         |
| CanCM                | • CAN 통신 관리<br>- CAN 데이터 송수신 제어        |
| CtrlRam              | • RAM 제어<br>- 메모리 관리                   |


---


## Microcontroller `Hardware`


> 마이크로컨트롤러는 ECU의 중심 처리 장치로, 모든 소프트웨어 계층이 직접적으로 상호작용하는 하드웨어입니다.


## 연결 문서·참고 자료


[상위 문서: AUTOSAR](https://app.notion.com/p/AUTOSAR-e20f9e7df0d34378beea96efa4172089)


[참고 출처 / 관련 공식 문서](https://www.autosar.org/standards/classic-platform)

