---
layout: default
title: UDS
has_children: false
published_date: 2024-06-11-09-06-00
last_modified_date: 2024-06-11-11-06-00
nav_order: 4
permalink: '/UDS'
redirect_from:
 - /89f6c72d1f3d44d6b2b7798ecb2eb4af
 - /undefined
---
# **UDS 프로토콜은 무엇인가?**


> UDS (Unified Diagnostic Services) 프로토콜은 자동차 산업에서 차량 내 전자 제어 시스템(ECU: Electronic Control Unit)의 진단, 테스트, 수리를 위해 사용되는 진단 통신 프로토콜이다.  
> 차량의 온보드 진단 (OBD: On Board Unit) 시스템과 진단 도구 간의 진단 및 제어 데이터를 교환하는 데 사용되는 표준화된 프로토콜이다.


# **UDS 프로토콜의 특징은?**


> UDS는 ISO 14229 표준에 기반을 두고 있으며, 진단을 위해 사용되는 서비스, 데이터 유형, 통신 규칙을 정의함  
> 이 프로토콜은 진단기능에 맞춰 표준화된 접근법을 제공함으로써 다양한 유형의 차량을 진단 및 수리과정을 쉽게 만들어줌  
> UDS 프로토콜은 클라이언트-서버 (Client - Server) 모델을 사용하며, 진단 도구를 클라이언트로, 차량 ECU를 서버로 구성함  
> 클라이언트는 서버에 요청을 보내고, 서버는 요청된 정보를 응답


# **UDS 프로토콜 메시지 구조**


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
UDS (Unified Diagnostic Services) 메시지는 ISO 14229 표준을 따르는 특정한 구조를 가짐<br>Application Layer (ISO 14229-1)<br>Session Layer (ISO 14229-2)
</div>
</div>
</blockquote>

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/UDS/1.webp" href="/_images/UDS/1.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS/1.webp" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>



| Frame Type                 | Byte 0   | \<                                                 | Byte 1 <br>Service ID (for UDS) | Byte 2 <br>Data        | …  | Byte 7 <br>Data |
| -------------------------- | -------- | -------------------------------------------------- | ------------------------------- | ---------------------- | -- | --------------- |
| Bit offset                 | Bit 7-4  | Bit 3-0                                            | Bit 15-8                        | Bit 23-16              | …  | Bit 63-56       |
| Single Frame<br>(SF)       | Type = 0 | (0-7) Single frame data length                     | Data A                          | Data B                 | …  | Data G          |
| First Frame<br>(FF)        | Type = 1 | Data length of multi frame data size (8-4096) Byte | \<                              | Data A                 | …  | Data F          |
| Consecutive Frame<br>(CF)  | Type = 2 | Sequence number index (0-15)                       | Data A                          | Data B                 | …  | Data G          |
| Flow Control Frame<br>(FC) | Type = 3 | Flow Control Flag (0, 1, 2)                        | Block size                      | Separation Time/ST min | NA | \<              |

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/UDS/2.webp" href="/_images/UDS/2.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS/2.webp" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>



## CAN ID

- CAN 프로토콜에서 각 메시지는 고유한 식별자(CAN ID)를 가짐
- 이 ID는 메시지의 우선순위를 결정하는데 사용되며, ID가 낮을 수록 우선순위가 높음

## Protocol Control Info(PCI)

- UDS 메시지에서 데이터의 길이와 형식을 나타냄
- PCI는 실제 데이터에 대한 정보를 제공하며, 데이터가 어떤 형식인지(단일 프레임, 첫 번째 프레임, 연속 프레임 등)를 결정하는데 사용

## Negative Response SID

- UDS 프로토콜에서, 응답(Response)이 Negative한 경우. 즉, 요청이 성공적으로 처리되지 못한 경우 Negative Response Service ID가 사용됨
- 이는 클라이언트에게 요청이 실패했음을 알리는데 사용됨

## Rejected SID

- 요청된 SID(Service ID)가 정상적으로 처리되지 못하거나 버전이 지원되지 않는 경우에 사용
- 이는 클라이언트에게 해당 서비스가 현재 처리될 수 없거나 지원되지 않음을 알림

## Negative Response Code(NRC)

- 요청이 Negative로 처리된 경우, NRC는 Negative Response의 원인을 알려줌
- 예를 들어, 요청된 기능이 서버에 의해 지원되지 않거나, 요청된 서비스가 현재 실행되지 못하는 상황 등을 나타낼 수 있음

## Padding

- UDS 메시지는 일정한 길이를 유지해야함, 따라서 메시지가 해당 길이에 도달하지 못하는 경우 나머지 부분은 ‘패딩(Padding’으로 채움
- 일반적으로 0또는 A, 특정 값으로 설정됨

# UDS serivce Identifiers(SIDs)


| UDS SID (request) | UDS SID (response) | Service                            | Details                                                               |
| ----------------- | ------------------ | ---------------------------------- | --------------------------------------------------------------------- |
| 0x10              | 0x50               | Diagnostic Session Control         | Control which UDS services are available                              |
| 0x11              | 0x51               | ECU Reset                          | Reset the ECU (“hard reset”, “key off", “soft reset”)                 |
| 0x27              | 0x67               | Security Access                    | Enable use of security-critical services via authentication           |
| 0x28              | 0x68               | Communication Control              | Turn sending/receiving of messages on/off in the ECU                  |
| 0x29              | 0x69               | Authentication                     | Enable more advanced authentication vs. 0x27 (PKI based exchange)     |
| 0x3E              | 0x7E               | Tester Present                     | Send a "heartbeat" periodically to remain in the current session      |
| 0x83              | 0xC3               | Access Timing Parameters           | View/modify timing parameters used in client/server communication     |
| 0x84              | 0xC4               | Secured Data Transmission          | Send encrypted data via ISO 15764 (Extended Data Link Security)       |
| 0x85              | 0xC5               | Control DTC Settings               | Enable/disable detection of errors (e.g. used during diagnostics)     |
| 0x86              | 0xC6               | Response On Event                  | Request that an ECU processes a service request if an event happens   |
| 0x87              | 0xC7               | Link Control                       | Set the baud rate for diagnostic access                               |
| 0x22              | 0x62               | Read Data By Identifier            | Read data from targeted ECU - e.g. VIN, sensor data values etc.       |
| 0x23              | 0x63               | Read Memory By Address             | Read data from physical memory (e.g. to understand software behavior) |
| 0x24              | 0x64               | Read Scaling Data By Identifier    | Read information about how to scale data identifiers                  |
| 0x2A              | 0x6A               | Read Data By Identifier Periodic   | Request ECU to broadcast sensor data at slow/medium/fast/stop rate    |
| 0x2C              | 0x6C               | Dynamically Define Data Identifier | Define data parameter for use in 0x22 or 0x2A dynamically             |
| 0x2E              | 0x6E               | Write Data By Identifier           | Program specific variables determined by data parameters              |
| 0x3D              | 0x7D               | Write Memory By Address            | Write information to the ECU's memory                                 |
| 0x14              | 0x54               | Clear Diagnostic Information       | Delete stored DTCs                                                    |
| 0x19              | 0x59               | Read DTC Information               | Read stored DTCs, as well as related information                      |
| 0x2F              | 0x6F               | Input Output Control By Identifier | Gain control over ECU analog/digital inputs/outputs                   |
| 0x31              | 0x71               | Routine Control                    | Initiate/stop routines (e.g. self-testing, erasing of flash memory)   |
| 0x34              | 0x74               | Request Download                   | Start request to add software/data to ECU (incl. location/size)       |
| 0x35              | 0x75               | Request Upload                     | Start request to read software/data from ECU (incl. location/size)    |
| 0x36              | 0x76               | Transfer Data                      | Perform actual transfer of data following use of 0x74/0x75            |
| 0x37              | 0x77               | Request Transfer Exit              | Stop the transfer of data                                             |
| 0x38              | 0x78               | Request File Transfer              | Perform a file download/upload to/from the ECU                        |
|                   | 0x7F               | Negative Response                  | Sent with a Negative Response Code when a request cann                |


### Diagnostic Session Control (0x10)

- ECU가 진단 모드로 전환
- 차량의 정상 모드에서 테스트 모드로 전환할 때 사용

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x10 - 진단 세션을 시작하여 ECU를 테스트 모드로 전환
</div>
</div>
</blockquote>



### ECU Reset (0x11)

- ECU를 재설정
- 하드 리셋, 키 오프 또는 소프트 리셋을 포함

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x11 - 하드 리셋 명령을 보내 ECU를 재부팅
</div>
</div>
</blockquote>



### Security Access (0x27)

- 보안이 중요한 서비스를 사용하기 위해 인증을 활성화

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x27 - ECU 보안 접근을 위해 암호화된 키를 요청
</div>
</div>
</blockquote>



### Communication Control (0x28)

- ECU의 메시지 송수신 기능을 켜거나 끔

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x28 - ECU의 모든 통신을 비활성화
</div>
</div>
</blockquote>



### Authentication (0x29)

- 더 발전된 인증 절차를 사용하여 ECU에 접근

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x29 - PKI 기반 인증을 사용하여 ECU 접근을 요청
</div>
</div>
</blockquote>



### Tester Present (0x3E)

- 현재 세션을 유지하기 위해 주기적으로 “Heart Beat" 메시지를 전송

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x3E - ECU가 현재 세션을 종료하지 않도록 Heart Beat를 전송
</div>
</div>
</blockquote>



### Access Timing Parameters (0x83)

- 클라이언트/서버 통신에 사용되는 타이밍 매개변수를 조회하거나 수정

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x83 - 타이밍 매개변수를 수정하여 통신 지연 시간을 줄임
</div>
</div>
</blockquote>



### Secured Data Transmission (0x84)

- ISO 15764를 통해 암호화된 데이터를 전송

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x84 - 암호화된 진단 데이터를 ECU에 전송
</div>
</div>
</blockquote>



### Control DTC Settings (0x85)

- 오류 감지를 활성화하거나 비활성화

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x85 - 특정 오류 코드 감지를 비활성화
</div>
</div>
</blockquote>



### Response On Event (0x86)

- 이벤트가 발생했을 때 ECU가 서비스 요청을 처리하도록 요청

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x86 - 특정 조건이 만족되면 ECU가 응답하도록 설정
</div>
</div>
</blockquote>



### Link Control (0x87)

- 진단 액세스를 위한 통신 속도를 설정

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x87 - ECU와의 통신 속도를 500 kbps로 설정
</div>
</div>
</blockquote>



### Read Data By Identifier (0x22)

- 타겟 ECU로부터 데이터를 읽어옴

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x22 - 차량의 VIN 번호를 ECU로부터 읽어옴
</div>
</div>
</blockquote>



### Read Memory By Address (0x23)

- 타켓 ECU로부터 물리적 메모리에서 데이터를 읽어옴

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x23 - ECU의 특정 메모리 주소에서 데이터를 읽어옴
</div>
</div>
</blockquote>



### Read Scaling Data By Identifier (0x24)

- 데이터 식별자의 스케일링 정보를 읽어옴 

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x24 - 센서 데이터의 스케일링 정보를 조회
</div>
</div>
</blockquote>



### Read Data By Identifier Periodic (0x2A)

- ECU에 센서 데이터를 주기적으로 방송하도록 요청

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x2A - ECU가 센서 데이터를 초당 1회 주기로 방송하도록 설정
</div>
</div>
</blockquote>



### Dynamically Define Data Identifier (0x2C)

- 0x22 또는 0x2A에서 동적으로 사용할 데이터 매개변수를 정의

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x2C - 새로운 데이터 식별자를 동적으로 정의
</div>
</div>
</blockquote>



### Write Data By Identifier (0x2E)

- 데이터 매개변수에 의해 결정된 특정 변수를 프로그래밍

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x2E - ECU의 특정 설정 값을 업데이트
</div>
</div>
</blockquote>



### Write Memory By Address (0x3D)

- ECU 메모리에 정보를 작성

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x3D - ECU의 특정 메모리 위치에 데이터를 작성
</div>
</div>
</blockquote>



### Clear Diagnostic Information (0x14)

- 저장된 DTC(진단 트러블 코드)를 삭제

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x14 - ECU에서 모든 DTC를 삭제
</div>
</div>
</blockquote>



### Read DTC Information (0x19)

- 저장된 DTC와 관련 정보를 읽어옴

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x19 - ECU에서 현재 저장된 모든 DTC를 읽어옴
</div>
</div>
</blockquote>



### Input Output Control By Identifier (0x2F)

- ECU 아날로그/디지털 입력/출력을 제어

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x2F - 특정 출력 핀을 활성화
</div>
</div>
</blockquote>



### Routine Control (0x31)

- 테스트 루틴을 시작하거나 중지합니다 (예: 자가 테스트, 플래시 메모리 지우기)

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
 0x31 - ECU의 자가 테스트 루틴을 시작
</div>
</div>
</blockquote>



### Request Download (0x34)

- ECU에 소프트웨어/데이터 추가를 요청합니다 (위치/크기 포함)

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x34 - ECU에 새로운 소프트웨어를 다운로드
</div>
</div>
</blockquote>



### Request Upload (0x35)

- ECU에서 소프트웨어/데이터를 읽어오도록 요청합니다 (위치/크기 포함)

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x35 - ECU에서 데이터를 업로드
</div>
</div>
</blockquote>



### Transfer Data (0x36)

- 0x74/0x75 명령 후 실제 데이터를 전송

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x36 - ECU로 데이터 전송을 수행
</div>
</div>
</blockquote>



### Request Transfer Exit (0x37)

- 데이터 전송을 중지

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x37 - 현재 진행 중인 데이터 전송을 중지
</div>
</div>
</blockquote>



### Request File Transfer (0x38)

- ECU와의 파일 다운로드/업로드를 수행

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x38 - ECU와 파일 업로드를 수행
</div>
</div>
</blockquote>



### Negative Response (0x7F)

- 요청이 처리될 수 없을 때 부정 응답 코드와 함께 전송

<blockquote class="white">
<div class="callout">
<div class="callout-icon" markdown="1">
📝 
</div>
<div class="callout-content" markdown="1">
0x7F - 요청된 서비스가 지원되지 않는 경우 부정 응답을 반환
</div>
</div>
</blockquote>


