---
layout: default
title: FlexRay
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 5
parent: '차량 통신'
permalink: '/차량_통신/FlexRay'
redirect_from:
 - /3f71b412900a819692a8fe50df1d07ad
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


> 시간 기반 슬롯과 네트워크 동기화를 중심으로 FlexRay의 통신 구조를 정리한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
ISO 17458 시리즈와 프로젝트 클러스터 설정을 기준으로 세부 조건을 확인한다.
</div>
</div>
</blockquote>



## 본문


### 통신 구조


FlexRay는 통신 주기를 기반으로 static segment와 dynamic segment를 포함하는 구조를 사용한다. Static segment는 사전에 구성된 시간 슬롯을, dynamic segment는 minislot 기반의 접근을 고려한다.


### 채널과 속도


채널당 10 Mbit/s를 지원하는 체계를 다루며 A/B 두 채널은 구성에 따라 이중화 또는 다른 통신 용도로 사용될 수 있다. 두 채널이 있다고 자동으로 고장 허용이 보장되는 것은 아니다.


### 주요 설정


클러스터 주기, 슬롯 ID, 페이로드, 채널 선택, startup/sync 노드, 시계 동기화와 전원 상태를 연결해 확인한다. 노드별 설정과 전체 클러스터 설정의 일관성이 중요하다.


### 분석 관점


프레임 누락이 발생하면 슬롯·주기·채널·startup 상태와 동기화를 함께 본다. 단순 버스 부하뿐 아니라 시간 슬롯 할당과 상태 전이를 분석한다.


### 검증 항목

- cold start와 노드 합류.
- 슬롯·주기·채널 설정의 일치.
- 동기화와 통신 지연·주기 변동.
- 채널 고장 시 실제 시스템의 반응.

### 실습: 슬롯·주기 분석


설명용 구성: 5 ms 통신 주기에 제어 명령과 상태 응답의 static slot을 각각 배치한다. 송신 노드·slot ID·channel·cycle 조건을 설정표로 만든다.


분석 도구에서 여러 주기의 timestamp를 추출해 슬롯별 송신 간격과 누락을 확인한다. 같은 slot ID라도 cycle 조건과 channel이 다르면 같은 통신이라고 단정하지 않는다.


Startup 실패 시 클러스터 설정, startup/sync 노드, 배선과 시계 상태 순으로 비교한다. 프레임 수신 성공만으로 이중화 시험을 통과 처리하지 않는다.

