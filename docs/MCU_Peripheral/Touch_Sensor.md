---
layout: default
title: Touch Sensor
has_children: false
published_date: 2026-10-14-15-10-00
last_modified_date: 2026-10-14-15-10-00
nav_order: 4
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/Touch_Sensor'
redirect_from:
 - /3f91b412900a81d09942c1e319a88c65
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


정전용량 터치는 손가락 접근에 따른 전극의 정전용량 변화를 측정한다. raw 값을 baseline과 비교해 delta를 계산하고 threshold·hysteresis·debounce로 안정된 이벤트를 만든다. 부품명과 전극 구조가 확정되지 않은 상태에서 특정 레지스터나 감도 값을 고정하지 않는다.


## 구현 방식 선택

- 외부 터치 IC: 전극 측정과 보정을 IC가 담당한다. MCU는 I2C/SPI 설정, IRQ, 상태·raw 값 읽기와 제품 이벤트를 구현한다. 데이터시트에서 재보정·습기·stuck 처리 옵션을 확인한다.
- MCU 직접 측정: GPIO·timer·ADC 등의 충방전 측정 방식과 아날로그 회로를 직접 설계한다. 일반 ADC가 정전용량을 곧바로 출력하는 것은 아니다. S32K312에 원하는 전용 touch IP가 있다고 가정하지 않는다.

실무에서는 먼저 센서 부품, 전극 크기·간격, overlay 재질·두께, 접지·shield 구조와 목표 환경을 확정한다. 센서 감도만 올리는 방식으로 두꺼운 패널·긴 배선·물방울 문제를 해결하려 하지 않는다.


## 외부 터치 IC 연결·설정 절차

- 전원·I/O 레벨·RESET·IRQ 극성과 pull 요구를 확인하고 I2C 주소 또는 SPI mode·최대 클록을 설정한다. 공통 버스에는 중복 주소·CS 충돌이 없어야 한다.
- chip ID 또는 상태 register 읽기로 통신을 검증한 뒤 채널 enable, acquisition/scan period, sensitivity와 threshold를 설정한다. 설정값 readback을 지원하면 비교한다.
- IRQ 의미가 edge인지 level인지, status 읽기가 flag를 지우는지 확인한다. ISR에서는 이벤트를 알리고 task에서 버스 읽기·상태 처리를 수행한다.
- 시작 시 손가락이 닿아 있는 경우, startup calibration 실패, 장시간 누름, 통신 timeout과 센서 reset을 상태 머신에 포함한다.

## raw·baseline·delta 분리


센서마다 touch가 raw 증가 또는 감소로 나타날 수 있다. delta를 항상 raw−baseline으로 가정하지 말고 부품의 표현을 확인한다. 비터치 상태에서는 baseline이 느린 온도·습도 변화를 따라가게 하되, 터치 중에는 baseline이 손가락 신호를 흡수하지 않도록 업데이트 정책을 둔다.


```python
# 설명용: touch에서 raw가 증가하는 센서, 일정한 주기로 호출
class TouchFilter:
    def __init__(self, initial):
        self.baseline = float(initial)
        self.pressed = False
        self.count = 0

    def update(self, raw):
        delta = raw - self.baseline
        wanted = delta > (30 if self.pressed else 50)
        if wanted != self.pressed:
            self.count += 1
            if self.count >= 3:
                self.pressed = wanted
                self.count = 0
        else:
            self.count = 0
        # 터치 후보 구간에서도 baseline을 고정
        if not self.pressed and delta < 30:
            self.baseline += 0.01 * (raw - self.baseline)
        return self.pressed

sensor = TouchFilter(1000)
assert [sensor.update(1100) for _ in range(3)] == [False, False, True]
assert [sensor.update(1000) for _ in range(3)] == [True, True, False]
```



threshold 50/30, 연속 3회, 계수 0.01은 알고리즘 설명용이다. 실제 센서 raw 범위·샘플 주기·비터치 분산·최약 터치 delta를 측정해 정한다. 외부 IC가 이미 filtering과 debounce를 제공하면 MCU가 추가한 지연까지 합산해 응답시간을 평가한다.


## 직접 정전용량 측정 시


저항과 전극 capacitance의 RC 충방전 시간을 timer로 측정하거나 정해진 충전 시간 후 전압을 ADC로 측정하는 방법이 있다. 핀 구동·high-impedance 전환, ADC sample capacitance, 누설과 외부 보호 회로가 측정에 영향을 준다. 검증된 회로 없이 GPIO 방향 전환 코드만으로 제품 수준의 터치를 구현했다고 판단하지 않는다.


## 오검출과 사용자 경험

- 물·장갑·습도·온도·접지 상태·충전기·인접 PWM·ESD 조건에서 false touch와 missed touch를 구분해 기록한다.
- 인접 전극 간 동시 터치·palm·슬라이더 처리 정책을 정의한다. 클릭·길게 누름 이벤트는 안정화된 touch 상태에서 생성한다.
- stuck timeout은 고장 판단과 장시간 사용자 누름을 구분해야 한다. 무조건 baseline을 즉시 재설정하면 누른 손가락을 비터치로 학습할 수 있다.

## 검증 결과에 남길 값


IC·firmware 버전, 전극·overlay 조건, scan period, raw/baseline/delta 분포, on/off threshold, debounce 시간, 응답시간과 false/missed 비율을 함께 기록한다. 통신 성공, 센서 감지 성공, 사용자 이벤트 품질을 별도로 검증한다.

