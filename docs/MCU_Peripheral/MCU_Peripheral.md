---
layout: default
title: MCU Peripheral
has_children: true
published_date: 2026-10-14-15-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 7
permalink: '/MCU_Peripheral'
redirect_from:
 - /3f91b412900a810ab8d8eff3a8c51fbf
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


> S32K312의 GPIO·ADC와 버튼·터치 입력을 연결해 실제 애플리케이션 이벤트로 만드는 설정·구현 자료다. 클록·핀·주변장치 초기화, 비동기 처리, 필터링, 오류 검출을 공통 구조로 사용한다.


## 개발 환경과 적용 순서


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
S32K312와 S32K3 RTD를 기준으로 한다. 설치 버전의 IP 드라이버 예제 또는 AUTOSAR MCAL 예제 중 한 계층을 선택한다. 아래 board_* 이름은 설명용 어댑터이며 NXP API 이름이 아니다. 실제 핀 번호·클록·채널·레지스터 값은 패키지, 회로도, Reference Manual과 생성 코드에서 확정한다.
</div>
</div>
</blockquote>


- GPIO → 물리 버튼: 입력 전압과 pull 설정을 확인한 뒤 debounce와 이벤트 처리를 추가한다.
- ADC: 기준 전압·입력 범위·소스 임피던스를 확인한 뒤 샘플 시간·변환·필터링을 구성한다.
- Touch Sensor: 외부 터치 IC인지 MCU 직접 정전용량 측정인지 먼저 확정하고 baseline·threshold·오검출 검증을 진행한다.
- 검증 순서: 정적 입력 → 주기적 측정 → 인터럽트·DMA → 부하·노이즈·저전력 복귀 조건으로 확대한다.
