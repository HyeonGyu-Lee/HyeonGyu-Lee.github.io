---
layout: default
title: "DTC (Diagnostic Trouble Code)"
has_children: false
published_date: 2024-06-20T00:40:00.000Z
last_modified_date: 2026-10-14T13:25:00.000Z
nav_order: 3
parent: "UDS (Unified Diagnostic Services)"
permalink: '/UDS_(Unified_Diagnostic_Services)/DTC_(Diagnostic_Trouble_Code)'
redirect_from:
 - "/6a79edc83476430b85fbc4dc270ad541"
---

## 같은 고장이 현재 발생 중인지 과거 기록인지 판단하는 상황

DTC 번호는 fault의 식별자이며 status byte와 snapshot·extended data가 시간적 상태와 주변 정보를 보완한다. 단순히 코드가 존재한다는 사실만으로 현재 고장을 단정할 수 없다.

> DTC 상태를 비트·마스크로 해석하고 고장 주입부터 제거·재시작까지 상태 변화를 확인한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
실행 예제의 주소·선택자·인터페이스·설정값은 시험 환경에 맞게 변경한다. 규격의 적용 판과 도구 버전을 확인한다.
</div>
</div>
</blockquote>





### 핵심 요약


DTC는 진단 대상 고장을 식별하는 코드다. UDS에서 전달하는 DTC 값, 상태 바이트, 관련 부가 데이터는 구분해서 읽는다. DTC는 배출가스 OBD 용도로만 사용되는 것은 아니다.


### DTC와 상태 바이트


동일한 DTC도 현재 실패 여부, 이번 동작 주기의 테스트 상태, 과거 고장 확인 여부에 따라 상태가 달라질 수 있다. DTC 번호만으로 현재 고장·근본 원인·수리 완료 여부를 확정하지 않는다.


### 상태 바이트의 비트


| **항목**                                       | **설명 및 적용 기준**                              |
| -------------------------------------------- | ------------------------------------------- |
| **bit 0 testFailed**                         | 마지막 테스트 결과의 실패 상태.                          |
| **bit 1 testFailedThisOperationCycle**       | 이번 동작 주기에 실패한 상태.                           |
| **bit 2 pendingDTC**                         | pending 상태. 정확한 설정·해제 조건은 규격과 모니터 정책을 확인한다. |
| **bit 3 confirmedDTC**                       | confirmed 상태. 고장 확인 조건과 수명 주기를 확인한다.        |
| **bit 4 testNotCompletedSinceLastClear**     | 마지막 초기화 이후 테스트 미완료 상태.                      |
| **bit 5 testFailedSinceLastClear**           | 마지막 초기화 이후 실패 이력.                           |
| **bit 6 testNotCompletedThisOperationCycle** | 이번 동작 주기에서 테스트 미완료 상태.                      |
| **bit 7 warningIndicatorRequested**          | 경고 표시 요청 상태. 모든 DTC가 이 비트를 지원한다고 가정하지 않는다.  |


### 마스크 해석 예시


설명용 상태값 0x09는 bit 0과 bit 3이 설정된 값이다. 실제 ECU에서는 DTCStatusAvailabilityMask로 지원 비트를 먼저 확인한다. 요청 상태 마스크에 포함된 비트 중 하나라도 설정된 DTC를 선택하는 경우와, 모든 조건이 동시에 충족돼야 한다고 해석하는 경우를 혼동하지 않는다.


### 관련 서비스와 저장 데이터


ReadDTCInformation(0x19)은 하위 기능에 따라 건수·목록·스냅샷·확장 데이터 등을 조회한다. ClearDiagnosticInformation(0x14)은 지정한 범위의 진단 정보를 초기화하는 서비스이며, 물리적 고장 원인을 제거하는 작업은 아니다.


### 검증 시나리오

- 정상 상태의 모니터 완료 여부를 먼저 기록한다.
- 설명용 시험 환경에서 고장을 주입하고 디바운스·확인 조건과 상태 변화를 관찰한다.
- 고장 제거와 동작 주기 전환 후 pending·confirmed·현재 실패 상태를 각각 확인한다.
- 전원 재인가, 초기화, 저장 정책에 따른 유지·해제 동작을 검증한다.
- 모니터와 저장 정책은 AUTOSAR DEM, 진단 요청 인터페이스는 DCM 관점에서 연결해 본다.

### 확인할 출처와 범위


ISO 14229-1 및 프로젝트 DTC 정의서: https://www.iso.org/search.html?q=ISO%2014229-1


AUTOSAR Classic DEM·DCM의 해당 릴리스: https://www.autosar.org/standards/classic-platform


### 실습: 상태 마스크 읽기


```c
#include <assert.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
int main(void) {
 const uint8_t status = 0x09, availability = 0xFF, request_mask = 0x08;
 const uint8_t effective = status & availability;
 printf("testFailed=%d confirmedDTC=%d match=%d\n",
  !!(effective & 0x01), !!(effective & 0x08), !!(effective & request_mask));
 assert((effective & request_mask) != 0);
 return 0;
}
```



설명용 값 0x09에서 testFailed·confirmedDTC를 확인한다. 실제 지원 비트와 상태 전이는 ECU 모니터·저장 정책에 따른다.


고장 주입 → debounce/확인 조건 충족 → DTC 조회 → 고장 제거 → 동작 주기 전환 → 전원 재인가 순서로 상태를 기록한다. ClearDiagnosticInformation 이후에도 원인이 남으면 재검출될 수 있다.


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
Diagnostic Trouble Code : 차량의 On-Board Diagnostics (OBD) 시스템에서 차량의 문제를 진단하고 경고할 때 사용하는 코드입니다. DTC는 차량의 전자 제어 장치(ECU)가 차량의 특정 문제를 감지하면 생성되며, 이를 통해 정비사는 문제를 식별하고 수정할 수 있습니다.
</div>
</div>
</blockquote>



# DTC Status Byte


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
DTC 정보를 포함한 응답 메시지의 일부<br>Read DTC Information (0x19) 서비스 요청 시 반환
</div>
</div>
</blockquote>


- DTC의 상태를 나타내는 1바이트의 데이터
- 8개의 개별 비트로 구성되며, 각 비트는 DTC의 특정 상태를 나타냄
- DTC Status Byte는 ECU가 진단 도구에 오류의 현재 상태를 보고하는 데 사용

| bit # | hex  | state                              | description                                           |
| ----- | ---- | ---------------------------------- | ----------------------------------------------------- |
| 0     | 0x01 | testFailed                         | DTC failed at the time of the request                 |
| 1     | 0x02 | testFailedThisOperationCycle       | DTC failed on the current operation cycle             |
| 2     | 0x04 | pendingDTC                         | DTC failed on the current or previous operation cycle |
| 3     | 0x08 | confirmedDTC                       | DTC is confirmed at the time of the request           |
| 4     | 0x10 | testNotCompletedSinceLastClear     | DTC test not completed since the last code clear      |
| 5     | 0x20 | testFailedSinceLastClear           | DTC test failed at least once since last code clear   |
| 6     | 0x40 | testNotCompletedThisOperationCycle | DTC test not completed this operation cycle           |
| 7     | 0x80 | warningIndicatorRequested          | Server is requesting warningIndicator to be active    |

## 이해를 확인하는 질문

> DTC를 지우면 고장의 원인도 제거될까?

Clear는 진단 기록을 변경한다. 물리 원인과 monitor 조건이 남아 있으면 다시 검출될 수 있다.
