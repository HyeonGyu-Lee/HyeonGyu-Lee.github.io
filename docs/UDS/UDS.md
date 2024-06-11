---
layout: default
title: UDS
has_children: false
published_date: 2024-06-11-09-06-00
last_modified_date: 2024-06-11-09-06-00
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



| Frame Type                 | Byte 0   |                                                    | Byte 1 <br>Service ID (for UDS) | Byte 2 <br>Data        | …  | Byte 7 <br>Data |
| -------------------------- | -------- | -------------------------------------------------- | ------------------------------- | ---------------------- | -- | --------------- |
| Bit offset                 | Bit 7-4  | Bit 3-0                                            | Bit 15-8                        | Bit 23-16              | …  | Bit 63-56       |
| Single Frame<br>(SF)       | Type = 0 | (0-7) Single frame data length                     | Data A                          | Data B                 | …  | Data G          |
| First Frame<br>(FF)        | Type = 1 | Data length of multi frame data size (8-4096) Byte |                                 | Data A                 | …  | Data F          |
| Consecutive Frame<br>(CF)  | Type = 2 | Sequence number index (0-15)                       | Data A                          | Data B                 | …  | Data G          |
| Flow Control Frame<br>(FC) | Type = 3 | Flow Control Flag (0, 1, 2)                        | Block size                      | Separation Time/ST min | NA |                 |

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


Diagnostic Session Control
ECU Reset
Security Access
Communication Control
Authentication
Tester Present
Access Timing Parameters
Secured Data Transmission
Control DTC Settings
Response On Event
Link Control
Read Data By Identifier
Read Memory By Address
Read Scaling Data By Identifier
Read Data By Identifier Periodic
Dynamically Define Data Identifier
Write Data By Identifier
Write Memory By Address
Clear Diagnostic Information
Read DTC Information
Input Output Control By Identifier
Routine Control
Request Download
Request Upload
Transfer Data
Request Transfer Exit
Request File Transfer
Negative Response

