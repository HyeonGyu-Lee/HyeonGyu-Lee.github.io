---
layout: default
title: "Key Management & Provisioning"
has_children: false
published_date: 2026-10-14T13:02:00.000Z
last_modified_date: 2026-10-14T13:24:00.000Z
nav_order: 2
parent: "Security & Boot"
permalink: '/MCU_Peripheral/Security_&_Boot/Key_Management_&_Provisioning'
redirect_from:
 - "/3f91b412900a813abce6c90f8c54794b"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


> 암호 알고리즘 선택뿐 아니라 key 생성·배포·사용·교체·폐기와 제품 lifecycle을 설계한다. 개발 key와 양산 key를 분리하고 빌드 시스템의 서명 권한과 장치의 검증 권한을 구분한다.


## Lifecycle


```mermaid
flowchart LR
 G[Generate] --> P[Provision]
 P --> U[Use with Policy]
 U --> R[Rotate]
 R --> X[Revoke / Retire]
```



## Key Inventory


Key ID, 용도, 알고리즘, owner, 저장 위치, export 허용 여부, 활성 version과 교체 절차를 관리한다. 같은 key를 firmware 서명·진단 인증·데이터 암호화에 무분별하게 재사용하지 않는다. 장치별 key와 fleet 공통 key의 장애 영향 범위를 비교한다.


## Provisioning Procedure


대상 장치·firmware·lifecycle 확인 → 승인된 key material 또는 public key digest 준비 → vendor 절차로 설정 → readback 가능한 상태와 검증 동작 확인 → 감사 기록 순으로 진행한다. OTP/fuse/lifecycle 전이는 되돌릴 수 없거나 debug 접근을 제한할 수 있어 학습 코드에서 임의 주소에 쓰는 예제를 사용하지 않는다.


## Rotation and Recovery


신규 key로 서명된 업데이트를 기존 신뢰 체계가 검증할 수 있는 transition을 설계한다. key ID만 바꾸면 신뢰가 이전되지 않는다. compromised key 폐기·복구 이미지·미연결 장치의 업데이트 경로를 함께 검토한다.


## Verification


다른 장치용 이미지, 폐기된 key, 잘못된 usage, 중단된 provisioning, debug 접근 정책을 시험한다. error log에는 key 값 대신 key ID·status·단계만 남긴다. 실제 절차는 제조·보안 운영과 제품의 vendor security manual에 맞춘다.
