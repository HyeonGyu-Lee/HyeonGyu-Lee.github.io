---
layout: default
title: MCU Peripheral
has_children: true
published_date: 2026-10-14-15-10-00
last_modified_date: 2026-10-19-22-10-00
nav_order: 6
permalink: '/MCU_Peripheral'
redirect_from:
 - "/3f91b412900a810ab8d8eff3a8c51fbf"
---
## 하나의 sensor 입력을 여러 hardware 기능으로 구성하는 상황


Sensor와 actuator는 각각 물리량을 감지하거나 물리적 출력을 만드는 장치다. 측정·출력 제어는 application 기능이며, ADC, GPIO, timer, serial interface는 이를 구현하는 MCU peripheral이다. 하나의 기능에 여러 peripheral이 참여할 수 있으며 clock·pin·interrupt·DMA는 이들을 연결한다.


## MCU Peripheral 기능 지도


> Peripheral의 동작 원리와 활용 기능을 연결해 학습한다. 기반 설정 → GPIO·ADC·Timer·통신 Controller → sensor·입출력 기능 순서로 보고, Interrupt·DMA·Memory·복구 조건을 함께 확인한다.


{% include components/mcu-map.html %}


## 관계도 읽는 법


관계도의 기능을 선택하면 상세 문서로 이동한다. 확대·축소 버튼으로 크기를 조절하고, 작은 화면에서는 그림 영역을 가로로 스크롤하며 연결 관계를 확인한다.


실선은 대표적인 기능 연결, 점선은 구현 방식이나 hardware 지원에 따라 달라지는 관계다. 그림은 개별 MCU의 실제 block diagram이 아니라 학습 지도다. 모든 Peripheral에 연결되는 IRQ·DMA·Clock 선을 반복하지 않고 대표 경로를 표시한다.


## 간단한 활용은 여기서 연결


| 활용 기능       | 기반 기능                        | 설정과 판단 기준                                                                               |
| ----------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| LED On/Off  | GPIO Output                  | Active polarity·output 초기값·current limit를 확인한다. 전류 제한 저항과 필요 시 transistor/driver를 사용한다. |
| LED 밝기      | Timer + PWM + LED driver     | Frequency·duty·polarity·reload 시점·0/100%와 flicker 조건을 확인한다.                             |
| 가변저항        | ADC + analog pin + reference | 양 끝을 허용 전원과 GND에, wiper를 ADC 입력에 연결한다. Source impedance·sample time·filter를 함께 설정한다.    |
| Button      | GPIO Input + time base       | Pull-up/down·active level·debounce·short/long press 정책을 연결한다.                           |
| Touch Pad   | 측정 회로 + baseline/threshold   | GPIO/Timer로 RC 시간을 측정하거나 ADC 기반 회로, 전용 Touch IC를 사용한다. 방식에 따라 필요한 Peripheral이 다르다.      |
| 외부 Touch IC | I2C 또는 SPI + 필요 시 IRQ GPIO   | IC가 capacitance 측정·보정을 수행하고 MCU는 data/status를 읽는다. MCU ADC가 반드시 필요한 것은 아니다.             |


## 상세 문서의 범위


GPIO·ADC·Timer/Counter·PWM·Interrupt & ISR·SPI·I2C·UART는 기능 원리와 설정·C 예제를 다룬다. CAN Controller는 bit timing·FlexCAN·FD configuration을 하위 페이지로 나누고, Ethernet MAC & DMA는 descriptor·buffer·PHY interface를 다룬다.


Concurrency·DMA ownership·Memory·Watchdog·Security & Boot는 Peripheral을 안전하게 사용하는 실행·복구 조건이다. Clock·Reset·Pin Mux·전압·Reference는 모든 기능에 공통이므로 관계도에서 기반 설정으로 묶고 각 상세 문서에서 해당 IP의 조건을 확인한다.


## 차량 통신과의 구분


차량 통신에서는 ECU 간 topology·message contract·physical bus·vehicle protocol·network verification을 다룬다. MCU Peripheral에서는 같은 CAN/Ethernet 기술이라도 controller 내부 기능·driver·memory·interrupt 처리에 집중한다.


## S32K312 적용 전제


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
설치한 S32 RTD release와 S32K312 Reference Manual·pin map·errata로 실제 지원 IP와 API를 확인한다. 이 지도에 Ethernet MAC이나 특정 Touch engine이 있다는 이유로 S32K312에도 해당 hardware가 내장되어 있다고 가정하지 않는다.
</div>
</div>
</blockquote>



## 이해를 확인하는 질문


> Touch sensor는 항상 ADC 하나로 구현되는가?


측정 방식에 따라 GPIO·timer, 전용 touch controller 또는 외부 IC의 serial interface를 사용할 수 있다.

