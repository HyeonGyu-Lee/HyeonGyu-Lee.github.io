---
layout: default
title: ADC
has_children: false
published_date: 2026-10-14-15-10-00
last_modified_date: 2026-10-14-15-10-00
nav_order: 3
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/ADC'
redirect_from:
 - /3f91b412900a81029051d305edc556b5
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


ADC는 아날로그 전압을 디지털 코드로 변환한다. 결과의 품질은 해상도뿐 아니라 기준 전압, 입력 소스 임피던스, acquisition time, 변환 주기, 보정과 노이즈에 영향을 받는다.


## S32K312 ADC 설정 순서

- ADC 인스턴스·외부 입력 채널·패키지 핀을 회로도와 데이터시트로 매핑한다. 해당 핀의 아날로그 기능과 디지털 입력 buffer/pull 설정 요구를 확인한다.
- 기준 전압과 허용 입력 범위를 확인한다. ADC 핀의 GPIO 내전압과 ADC 변환 범위를 혼동하지 않는다. 센서가 범위를 넘으면 분압·보호·버퍼 회로를 설계한다.
- Clock 도구에서 ADC에 실제 공급되는 클록을 확인하고 데이터시트의 허용 범위를 지킨다. RTD의 Adc_Sar IP 또는 AUTOSAR Adc 계층 중 하나를 선택한다.
- 예제와 매뉴얼 순서에 따라 초기화·필요한 calibration을 수행하고 실패 상태를 처리한다. 외부 채널, 해상도·정렬, sample time, software/hardware trigger와 단일/그룹 변환을 설정한다.
- 처음에는 software trigger와 단일 채널로 확인한다. timer trigger·여러 채널·DMA는 기초 변환 검증 후 추가한다. 보정·획득 시간·총 변환 시간은 별개다.

## 획득 시간과 샘플링 주기


ADC 내부 샘플 커패시터는 입력 소스 저항을 통해 충전된다. 임피던스가 높을수록 짧은 acquisition time에서 오차가 커질 수 있다. 데이터시트의 입력 모델과 허용 임피던스 표를 우선 사용한다. 이상적인 1차 RC 모델에서는 0.5 LSB 이내 settling에 대략 R×C×ln(2^(N+1))가 필요하지만 스위치 저항·누설·보드 조건을 포함한 보장값은 아니다.


```text
획득 시간 = 설정한 acquisition cycle 수 / 실제 ADC clock
총 변환 시간 = acquisition + 변환 코어 시간 + 드라이버/trigger 지연
그룹 최소 시간 = 채널별 시간의 합 + 전환/하드웨어 overhead

설명용 가정: clock=40 MHz, acquisition=80 cycles
획득 시간 = 80 / 40 MHz = 2 us
이 2 us는 전체 변환 시간이 아니다.
```



## 전압·센서 값 변환 예제


다음은 N=12, 기준 전압을 실제로 3.3 V로 확인한 unipolar ADC의 끝점 기준 근사다. S32K312 모든 설정이 12비트·3.3V라는 뜻이 아니다. ADC 데이터시트의 코드 전이 정의에 따라 2^N 또는 2^N−1 기준 및 offset 보정을 선택한다.


```python
def adc_voltage(raw, bits, vref):
    maximum = (1 << bits) - 1
    if not 0 <= raw <= maximum:
        raise ValueError("ADC code outside range")
    return raw * vref / maximum

v_pin = adc_voltage(2048, 12, 3.3)
# 상단 10kΩ, 하단 10kΩ의 이상적인 분압 예시
v_input = v_pin * (10_000 + 10_000) / 10_000
print(v_pin, v_input)
assert abs(v_pin - 1.6504) < 0.001
```



저항 허용 오차·기준 전압 오차·ADC offset/gain·센서 출력 오차를 분리해 평가한다. 측정 대상 전압이 6.6V라고 해서 3.3V 기준 ADC 핀에 직접 연결해도 된다는 뜻은 아니다.


## 노이즈 필터와 임계값

- 평균 필터는 랜덤 노이즈를 줄일 수 있지만 응답 지연을 만든다. 합산 변수는 overflow가 나지 않을 폭을 사용한다.
- 이동 평균 또는 IIR의 계수는 샘플 주기와 함께 정의한다. y += α(x−y)에서 α만 기록하고 주기를 바꾸면 필터 응답도 달라진다.
- 상태 판정에는 on threshold와 off threshold를 분리하는 hysteresis를 적용한다. 범위 밖·단선·포화 값은 정상 평균에 섞기 전에 진단한다.

## DMA·다채널 처리


DMA buffer 길이·채널 순서·전송 폭·완료 이벤트를 확인한다. half/full 완료를 구분하고 DMA가 쓰는 영역을 CPU가 동시에 해석하지 않도록 소유권을 정한다. 첫 샘플 또는 채널 전환 후 settling이 필요한지는 매뉴얼과 실측으로 확인한다. callback에서 긴 연산 대신 완료 buffer를 작업 문맥으로 전달한다.


## 검증

- 안정된 입력원으로 0V·중간 전압·상한에 가까운 전압을 주고 DMM 실측값과 비교한다. ADC 최대 허용 범위를 초과하지 않는다.
- sample time과 소스 저항을 바꾸어 오차 변화를 측정한다. 디지털 통신·PWM 출력 동작 시 노이즈를 비교한다.
- 오버런·DMA 누락·trigger 속도 초과·보정 실패·전원 변동·저전력 복귀를 시험하고 raw 데이터·필터 후 값·실제 샘플 간격을 함께 기록한다.
