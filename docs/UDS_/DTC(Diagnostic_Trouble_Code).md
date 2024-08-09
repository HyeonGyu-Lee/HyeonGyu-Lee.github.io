---
layout: default
title: DTC(Diagnostic Trouble Code)
has_children: false
published_date: 2024-06-20-09-06-00
last_modified_date: 2024-08-09-10-08-00
nav_order: 3
parent: 'UDS '
permalink: '/UDS_/DTC(Diagnostic_Trouble_Code)'
redirect_from:
 - /6a79edc83476430b85fbc4dc270ad541
 - /undefined
---
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

