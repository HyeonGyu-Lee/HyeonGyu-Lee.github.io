---
layout: default
title: UDS (Unified Diagnostic Services)
has_children: true
published_date: 2024-06-11-09-06-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 3
permalink: '/UDS_(Unified_Diagnostic_Services)'
redirect_from:
 - /89f6c72d1f3d44d6b2b7798ecb2eb4af
 - /undefined
---
## 핵심 요약


> 진단 서비스, 요청·응답, 고장 상태를 서로 연결해 읽기 위한 문서다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
규격·도구 버전에 따른 동작 차이를 확인한다.
</div>
</div>
</blockquote>



## 본문


---


# **UDS 프로토콜은 무엇인가?**


> **UDS (Unified Diagnostic Services)** 프로토콜은 자동차 산업에서 차량 내 전자 제어 시스템(ECU: Electronic Control Unit)의 진단, 테스트, 수리를 위해 사용되는 진단 통신 프로토콜이다.  
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
UDS (Unified Diagnostic Services) 메시지는 ISO 14229 표준을 따르는 특정한 구조를 가짐 (CAN bus의 기본 구조를 따른다)<br>ISO 14229-1 (Application Layer)<br>ISO 14229-3 (Application Layer for CAN)<br>ISO 14229-2 (Session Layer)<br>ISO 15765-2 (Transport + Network Layer for CAN)<br>ISO 11898 (Physical + Data Link Layer for CAN)
</div>
</div>
</blockquote>



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
<a data-fslightbox="/_images/UDS_(Unified_Diagnostic_Services)/1.webp" href="/_images/UDS_(Unified_Diagnostic_Services)/1.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS_(Unified_Diagnostic_Services)/1.webp" title="" class="lazyload" />
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

## UDS Serivce Identifier(SID)


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
해당 자료의 자세한 내용은 [여기](/6c434e6207fc42a89f62176ec69d00be)에 있습니다.
</div>
</div>
</blockquote>


- 특정 진단 서비스를 식별하는 고유한 ID
- ECU Reset을 요청하려면 SID 0x11을 사용

## Request Data Parameters


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
2-byte(0~65535)인 Data Identifier (DID)를 포함한다
</div>
</div>
</blockquote>


- 서비스의 세부 기능을 정의
- 특정 요청에 대한 추가적인 세부 사항을 제공 (Sub function)

## **UDS Sub Function Byte**

- 서비스 요청을 수행하기 위해 필요한 추가 정보를 포함
- 예를 들어 identifiers, memory addresses, values 등을 포

## Padding

- UDS 메시지는 일정한 길이를 유지해야함, 따라서 메시지가 해당 길이에 도달하지 못하는 경우 나머지 부분은 ‘패딩(Padding)’으로 채움
- 일반적으로 0또는 A, 특정 값으로 설정됨

## Positive Response

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/UDS_(Unified_Diagnostic_Services)/2.webp" href="/_images/UDS_(Unified_Diagnostic_Services)/2.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS_(Unified_Diagnostic_Services)/2.webp" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>


- 요청된 서비스 ID에 0x40을 더한 값을 SID로 보냄 - ex) 0x10에 대한 Positive Response는 0x50
- Data payload에 요청된 작업에 대한 구체적인 응답 데이터를 보냄

## Negative Response

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/UDS_(Unified_Diagnostic_Services)/3.webp" href="/_images/UDS_(Unified_Diagnostic_Services)/3.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS_(Unified_Diagnostic_Services)/3.webp" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>



### Negative Response SID

- UDS 프로토콜에서, 응답(Response)이 Negative한 경우. 즉, 요청이 성공적으로 처리되지 못한 경우 Negative Response Service ID가 사용됨
- 이는 클라이언트에게 요청이 실패했음을 알리는데 사용됨

### Rejected SID

- 요청된 SID(Service ID)가 정상적으로 처리되지 못하거나 버전이 지원되지 않는 경우에 사용
- 이는 클라이언트에게 해당 서비스가 현재 처리될 수 없거나 지원되지 않음을 알림

### Negative Response Code(NRC)


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
해당 자료의 자세한 내용은 [여기](/0d9c3695803e41ed9a11aa5b632aab3a)에 있습니다.
</div>
</div>
</blockquote>


- 요청이 Negative로 처리된 경우, NRC는 Negative Response의 원인을 알려줌
- 예를 들어, 요청된 기능이 서버에 의해 지원되지 않거나, 요청된 서비스가 현재 실행되지 못하는 상황 등을 나타낼 수 있음

## **CAN ISO-TP - Transport Protocol (ISO 15765-2)**

- CAN ISO-TP (ISO 15765-2)는 CAN 버스에서 데이터를 전송하기 위한 표준 프로토콜
- 데이터를 단일 프레임(Single-frame) 또는 다중 프레임(Multi-frame)으로 나누어 전송

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/UDS_(Unified_Diagnostic_Services)/4.webp" href="/_images/UDS_(Unified_Diagnostic_Services)/4.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS_(Unified_Diagnostic_Services)/4.webp" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>



### **ISO-TP: Single-frame communication**

- 단일 프레임 통신은 데이터가 단일 CAN 프레임 내에 수용될 때 사용
-  단일 프레임은 데이터 길이와 데이터 필드를 포함

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/UDS_(Unified_Diagnostic_Services)/5.webp" href="/_images/UDS_(Unified_Diagnostic_Services)/5.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS_(Unified_Diagnostic_Services)/5.webp" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>



### **ISO-TP: Multi-frame communication**

- 다중 프레임 통신은 데이터가 단일 CAN 프레임에 수용될 수 없을 때 사용
- 첫 번째 프레임, 연속 프레임, 그리고 종료 프레임을 사용하여 데이터를 나누어 전송

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/UDS_(Unified_Diagnostic_Services)/6.webp" href="/_images/UDS_(Unified_Diagnostic_Services)/6.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="/_images/UDS_(Unified_Diagnostic_Services)/6.webp" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>


