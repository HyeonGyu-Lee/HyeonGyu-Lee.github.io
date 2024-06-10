---
layout: default
title: Dcm
has_children: false
published_date: 2024-06-05-12-06-00
last_modified_date: 2024-06-10-15-06-00
nav_order: 1
parent: 'Configure Parameters'
permalink: '/AUTOSAR/Configure_Parameters/Dcm'
redirect_from:
 - /6f1c6084d31946eebed1b8d172719bba
 - /undefined
---
<div class="arxml-container">
<div class="tree-container">
<div class="arxml" id="Dcm" data-files="_files/422.arxml"></div>
<div id="arxmlContent" markdown="1"></div>
</div>
<div class="details-container">
<div id="nodeDetails"></div>
</div>
</div>


# DSL (Diagnostic Session Layer)


## 소개

- [SWS_Dcm_00030] DSL 서브모듈의 모든 기능 영역은 ISO14229-1[15] 사양과 ISO15765-3[18]의 네트워크 독립적인 부분을 준수해야함

> DSL 서브모듈에는 네트워크에 의존하는 기능 영역이 없음  
> 구성 내에서 네트워크에 따라 일부 매개변수를 설정할 수 있음


## 사용 사례

- DSL 서브 모듈은 다음과 같은 기능을 제공
    - 세션 처리(ISO14229-1[15] 및 ISO15765-3[18]에서 요구하는 대로)
    - 어플리케이션 레이어 타이밍 처리(ISO14229-1[15] 및 ISO15763-3[18]에서 요구하는 대로)
    - 특정 응답 동작(ISO14229-1[15] 및 ISO15763-3[18]에서 요구하는 대로)

## 다른 모듈과의 상호작용

- DSL은 다른 모듈과 다음과 같은 상호 작용을 함
    - PduR 모듈
        - PduR 모듈은 수신 진단 요청에 대한 데이터를 제공
        - DSL 서브모듈은 진단 응답 출력을 트리거함
    - DSD 서브 모듈
        - DSL 서브모듈은 수신 요청에 대해 DSD 서브모듈에 알리고 데이터를 제공
        - DSD 서브모듈은 진단 응답의 출력을 트리거함
    - SW-C / DSP 서브 모듈
        - DSL 서브모듈은 보안 및 세션 상태에 대한 액세스를 제공
    - ComM 모듈
        - DSL 서브모듈은 ComM 모듈에 필요한 통신 동작을 보장

## 기능 설명


### 개요

- DSL 서브 모듈은 다음과 같은 기능을 제공
- **요청 처리(Request Handling):**
    - PduR 모듈에서 DSD 서브모듈로 요청을 전달함
    - 동신에 “TesterPresent”(유지 로직) 처리
- **응답 처리(Response Handling):**
    - DSD 서브 모듈에서 PduR 모듈로 응답을 전달
    - 테스터에게 응답 시간을 보장
    - 주기적 전송 지원
    - 응답 온 이벤트(ResponseOnEvent; ROE) 전송 지원
    - 세분화된 응답 지원
    - 어플리케이션에서 트리거된 응답 대기 중 응답 지원
- **보안 수준 처리(Security Level Handling):**
    - 보안 수준을 관리
- **세션 상태 처리(Session Status Handling):**
    - 세선 상태를 관리
    - 기본값이 아닌 활성 세션을 추적
    - 타이망을 수정
- **진단 프로토콜 처리(Diagnostic Protocol Handling):**
    - 다양한 진단 프로토콜 처리
    - 리소스 관리
- **통신 모드 처리(Communication Mode Handling):**
    - 통신 요구 사항 처리(Full- / Silent- / No Communication)
    - active / inactive 진단 표시
    - 모든 종류의 진단 전송을 active / inactive

### PduR 모듈에서 DSD 서브모듈로 요청 전달


> PduR 모듈은 새로운 진단 요청 콘텐츠의 수신이 시작될 때마다 DCM 모듈에 할당된 DcmRxPduId를 통해 DCM 모듈에 알림.  
> 이 때 Dcm_StartOfReception()을 호출하여 수신할 데이터 크기를 DCM 모듈에 알리고 첫 번째 프레임 또는 단일 프레임의 데이터를 제공하며, 데이터 크기가 버퍼 크기를 초과하거나 요청된 서비스를 사용할 수 없는 경우 DCM이 수신을 거부할 수 있도록 함  
> 이후 Dcm_CopyRxData를 호출하면 DCM 모듈이 제공된 버퍼에서 DCM 버퍼로 데이터를 복사하도록 요청  
> 진단 요청의 수신이 완료되면(Dcm_StartOfReception이 성공하면) PduR 모듈은 Dcm_TpRxIndication()을 호출하여 DCM 모듈에 수신 표시를 제공  
> DCM은 일반 연결을 사용할 수 있어야 하며, 여기서 주소 지정 정보는 DcmRxPdu의 메타데이터를 통해 Dcm_StartOfReception()에 의해 DCM에 제공됨  
> 이 주소 지정 정보는 응답 및 동일한 테스터의 요청 감지를 위해 저장 및 사용되어야함  
> 자세한 내용은 **일반 연결 처리 섹션**을 참고


```mermaid
sequenceDiagram
  participant PduR
  participant DcmRxPduId
  PduR -\>\> DcmRxPduId: Dcm_StartOfReception()
  PduR -\>\> DcmRxPduId: Dcm_CopyRxData()
  DcmRxPduId --\>\> PduR: Result = E_OK
	PduR-\>\>DcmRxPduId: Dcm_TpRxIndication()
  DcmRxPduId --\>\> PduR: Result = E_OK
	PduR-\>\>DcmRxPduId: Dcm_TpRxConfirmation()
```


- [SWS_Dcm_00111] DSL 서브모듈은 파라미터 Result = E_OK(SWS_Dcm_00093 참조)로 Dcm_TpRxIndication()을 호출한 후에만 수신 데이터를 DSD 서브모듈로 전달
- [SWS_Dcm_00241] 요청 메시지가 수신되는 즉시 (파라미터 Result = E_OK(SWS_Dcm_00093 참조)로 Dcm_TpRxIndication()을 호출한 후 연결된 Tx-DcmPduId에 대해 Dcm_TpTxConfirmation()을 호출하기 전까지) DSL 하위 모듈은 해당 DcmPduId를 차단해야함(SWS_Dcm_00351 참조). 이 요청을 처리하는 동안에는 해당 응답 메시지가 전송되고 DcmPduId가 다시 해제될 때까지 동일한 DcmDslConnection의 다른 요청(예: OBD 세션에 의해 향상된 세션이 종료될 수 있음)을 수신할 수 없음(동시 TesterPresent 요청 제외)

> API(프로토타입, 입출력 파라미터)에 대한 자세한 설명은 PduR 모듈의 인터페이스 설명에서 확인할 수 있음([2] 참조)  
> 진단 통신 어플리케이션에 따라 서로 다른 DcmPduId를 사용할 수 있음. 예를 들어:

- OBD DcmRxPduId : OBD 요청 수신용
- OBD DcmTxPduId : OBD 응답 전송용
- UDS phys DcmRxPduId : 물리적 주소가 지정된 UDS 요청 수신용
- UDS fuc DcmRxPduId : 기능적(Functionally) 주소가 지정된 UDS 요청 수신용
- UDS DcmTxPduId :  UDS 응답 전송용

> 주소 유형(phys/func)은 DcmRxPduId에 따라 구성됨(구성 매개변수 DcmDslProtocolRx 참조)  
> 전송 계층의 주소 지정 형식(확장 주소 지정, 일반 주소 지정)과 관계없이 기능적 수신과 물리적 수신에 대해 항상 다른 DcmRxPduId 값이 있기 때문에 DcmRxPduId별로 구성할 수 있음


### 동시 “TesterPresent”(”유지 로직”) [Concurrent \| “keep alive logic”]


> 테스터가 물리적 요청/응답과 병행하여 기능적인 “TesterPresent” 명령을 전송할 수도 있음  
> 이를 ISO14229-1[15]에서 “keep alive logic”이라고 함  
> 이 기능 “TesterPresent”는 물리적 요청과 동일한 DcmDslConnection에 속하는 별도의 DcmRxPduId(UDS 기능 DcmRxPduId)에서 수신됨  
> 이 경우 명시적으로 구성되지 않은 Dcm 내부 수신 버퍼가 사용됨  
> 이러한 이유로 기능적 TesterPresent(그리고 응답이 없는 기능적 TestPresent만)는 다음과 같은 방식으로 처리

- [SWS_Dcm_00112] PduR 모듈이 파라미터 Result = E_OK(SWS_Dcm_00093 참조)로 Dcm_TpRxIndication()을 호출하고 요청이 “suppressPosPspMsgIndicationBit”이 TRUE(SID = 0x3E, 서브펑션 =0x80)인 “TesterPresent” 명령이면 DSL 서브 모듈은 세션 타임아웃 타이머를 재설정함(S3Server)
- [SWS_Dcm_00113] PduR 모듈이 파라미터 Result = E_OK(SWS_Dcm_00093 참조)로 Dcm_TpRxIndication()을 호출하고 요청이 “suppressPosRspMsgIndicationBit”이 TRUE(SID = 0x3E, 서브펑션 = 0x80)로 설정된 “TestPresent” 명령이면 DSL 서브모듈은 추가 해석을 위해 이 요청을 DSD 서브 모듈에 전달하지 않아야함을 의미
- **SWS_Dcm_00013의 근거 :** DSL 서브모듈의 “TesterPresent” 기능을 우회하기 때문에 DCM 모듈은 지연 없이 다음 물리적 요청을 수신하고 처리할 수 있음
- [SWS_Dcm_01168] Dcm은 TesterPresent 요청이 “suppressPosRspMsgIndicationBit”이 TRUE로 설정된 기능 주소에서 수신된 경우에만 동시 요청으로 처리

### DSD 서브모듈에서 PduR 모듈로 응답 전달

- [SWS_Dcm_00114] DSD 서브모듈은 응답 전송을 위해 DSL 서브모듈에 요청함
- [SWS_Dcm_00115] DcmDslMainConnection의 진단 응답이 준비되면, DSL 서브모듈은 해당 DcmDslProtocolTxPduRef 파라미터를 PduId로 사용하여 PduR_DcmTransmit()을 호출하여 진단응답의 PduR 모듈로의 전송을 트리거 해야
