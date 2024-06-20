---
layout: default
title: DTC Status Byte
has_children: false
published_date: 2024-06-20-09-06-00
last_modified_date: 2024-06-20-10-06-00
nav_order: 3
parent: 'UDS'
permalink: '/UDS/DTC_Status_Byte'
redirect_from:
 - /6a79edc83476430b85fbc4dc270ad541
 - /undefined
---
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

