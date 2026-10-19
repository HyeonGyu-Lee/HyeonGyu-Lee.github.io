---
layout: default
title: Spi
has_children: false
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 10
parent: 'MCAL & I-O'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/MCAL_&_I-O/Spi'
redirect_from:
 - "/3f91b412900a81849b0cc864900a91de"
---
## Spi의 책임을 application 기능과 hardware 자원 관점에서 구분하는 상황


Peripheral driver는 MCU 자원을 설정·제어하고 상위 software는 신호와 기능의 의미를 다룬다. Channel, pin과 clock의 hardware 제약은 ECU별 configuration에 반영된다. Spi의 최상위 정의에는 SpiDemEventParameterRefs, SpiDriver, SpiGeneral 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.


## Spi의 역할


> SPI hardware와 channel/job/sequence 등의 통신 구성을 다루는 MCAL driver다.


## 표준 원문


| 항목           | 원문 값                                                           |
| ------------ | -------------------------------------------------------------- |
| SHORT-NAME   | Spi                                                            |
| TYPE         | ECUC-MODULE-DEF                                                |
| DESC         | Configuration of the Spi (Serial Peripheral Interface) module. |
| Multiplicity | [0..1]                                                         |


## 구성의 첫 계층


| 정의                       | Type                          | 개수     | 설명 원문                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ----------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SpiDemEventParameterRefs | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for the references to DemEventParameter elements which shall be invoked using the API Dem_ReportErrorStatus API in case the corresponding error occurs. The EventId is taken from the referenced DemEventParameter's DemEventId value. The standardized errors are provided in the container and can be extended by vendor specific error references. |
| SpiDriver                | ECUC-PARAM-CONF-CONTAINER-DEF | [1]    | This container contains the configuration parameters and sub containers of the AUTOSAR Spi module.                                                                                                                                                                                                                                                              |
| SpiGeneral               | ECUC-PARAM-CONF-CONTAINER-DEF | [1]    | General configuration settings for SPI-Handler                                                                                                                                                                                                                                                                                                                  |
| SpiPublishedInformation  | ECUC-PARAM-CONF-CONTAINER-DEF | [1]    | Container holding all SPI specific published information parameters                                                                                                                                                                                                                                                                                             |


## 전체 표준 Explorer


{% include components/standard-explorer.html module="Spi" %}


## 개수와 조건의 해석


[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.


## 기준과 범위


원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.


## 이해를 확인하는 질문


> Spi의 container 개수와 parameter 값의 범위는 어떻게 다른가?


Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.

