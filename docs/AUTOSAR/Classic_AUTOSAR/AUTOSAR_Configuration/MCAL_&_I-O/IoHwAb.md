---
layout: default
title: IoHwAb
has_children: false
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-22-10-00
nav_order: 11
parent: 'MCAL & I-O'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/MCAL_&_I-O/IoHwAb'
redirect_from:
 - "/3f91b412900a81a88584f0310f0d29b7"
 - "/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/IoHwAb"
---
## 같은 application에서 사용하는 signal를 서로 다른 ECU I/O에 연결하는 상황


IoHwAb는 ECU의 I/O 배치와 signal 처리 차이를 상위 기능에서 분리한다. GPIO·ADC 같은 driver의 hardware 단위와 application에서 사용하는 signal 단위를 연결하므로 pin 하나와 interface 하나가 항상 일대일 대응하는 것은 아니다.


## I/O Hardware Abstraction


> ECU의 sensor·actuator 연결과 신호 획득·출력 차이를 상위 software에서 분리하는 I/O 추상화 영역이다.


## 책임과 주변 모듈


| 영역          | 의미                                                                 |
| ----------- | ------------------------------------------------------------------ |
| Hardware 차이 | 같은 기능도 pin·외부 device·전기적 연결이 ECU마다 다를 수 있음                         |
| MCAL과 구분    | Adc·Dio·Pwm·Icu 등은 peripheral driver이고 IoHwAb는 ECU I/O 의미와 연결을 추상화 |
| RTE와의 관계    | 상위 SWC가 hardware 세부 구조에 직접 결합하지 않도록 interface를 구성                  |
| 표준과 공급사 구성  | IoHwAb의 역할 설명과 공급사의 구체적인 container/API 정의를 구분                      |


## Explorer 수록 여부


Explorer의 4.2.2 ECUC 데이터에는 IoHwAb module definition이 포함되어 있지 않다. IoHwAb의 interface와 configuration은 적용 규격 및 공급사 정의에 따른다.


## 표준 구조를 읽는 관점


Container는 의미 단위, parameter는 그 안의 값 정의, reference는 다른 구성과의 관계다. 데이터 type과 값 범위, 개수 범위, variant 조건을 구분한다. Module이 정의돼 있다는 사실만으로 특정 ECU에 그 module이 필수라는 뜻은 아니다.


## Multiplicity와 조건


[1]은 해당 부모 아래 정확히 하나, [0..1]은 선택적으로 하나, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모가 선택 구성이라면 그 자식의 [1]을 ECU 전체의 필수로 확대 해석하지 않는다. 조건·choice와 configuration class는 원본 metadata에서 함께 확인한다.


## 이해를 확인하는 질문


> IoHwAb가 있으면 physical I/O 조건을 몰라도 되는가?


상위 interface는 단순해질 수 있지만 범위·갱신 주기·invalid 상태와 hardware 제약은 그 계약에 반영되어야 한다.

