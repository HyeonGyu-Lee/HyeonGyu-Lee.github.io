---
layout: default
title: RAM, ROM & Flash
has_children: false
published_date: 2026-10-14-22-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 1
parent: 'Memory Architecture'
permalink: '/MCU_Peripheral/Memory_Architecture/RAM,_ROM_&_Flash'
redirect_from:
 - "/3f91b412900a81b2870fcba272b43118"
---
## 설정값을 전원 차단 후에도 보존하는 상황


RAM의 volatile lifetime과 Flash의 erase/program 단위는 저장 정책을 다르게 만든다. 값을 기록하는 코드보다 중간 실패 뒤 어떤 복사본을 유효하다고 판단하는지가 중요하다.


> RAM은 일반적으로 전원 유지가 필요한 작업 메모리, ROM은 읽기 전용 또는 출고 시 고정된 코드/데이터 영역을 가리킨다. Firmware가 저장된 Flash를 관습적으로 ROM이라고 부르기도 하지만 Flash는 지정된 erase/program 절차로 갱신할 수 있어 물리적 특성과 접근 규칙이 다르다.


## Practical Roles


SRAM은 runtime 변수·stack·buffer에, Flash는 code·상수·이미지·설정 저장에 사용한다. Boot ROM은 제품이 제공하는 부팅 코드일 수 있다. 실제 보존 여부는 power-on reset·warm reset·저전력·retention domain마다 다르다.


## Flash Constraints


erase block, program unit, alignment, bit transition, 최대 erase 횟수와 보존 조건을 확인한다. 설정값을 매 주기 Flash에 쓰지 않는다. EEPROM emulation을 사용하면 vendor 지원·wear leveling·중단 복구·실제 유효 용량을 확인한다.


## Power-loss-safe Settings


설정 record에 version·length·sequence·CRC와 commit 상태를 두고 새로운 record를 완성한 후 유효성을 전환하는 방식을 검토한다. CRC는 우발 오류 탐지용이며 인증이 아니다. commit 기록도 원자적이라고 가정하지 말고 Flash program 단위와 실패 모델에 맞춰 설계한다.


## ECC and Initialization


ECC 보호 RAM/Flash에서는 초기화되지 않은 영역 읽기와 올바르지 않은 쓰기가 fault를 유발할 수 있다. startup의 RAM 초기화·ECC 처리와 reset 원인을 확인한다. ECC가 있다고 모든 software corruption이 탐지되는 것은 아니다.


## Verification


메모리 보존 범위를 reset 종류별로 시험하고 초기화 누락·alignment 오류·Flash driver failure·record 손상을 주입한다. raw pointer로 memory map 전체를 읽는 방식은 MMIO 부작용과 접근 fault를 유발할 수 있으므로 디버거와 vendor 도구를 목적에 맞게 사용한다.


## 이해를 확인하는 질문


> CRC가 맞으면 최신 설정값이라고 볼 수 있을까?


CRC는 손상 탐지에 관한 정보다. Generation과 commit 상태를 함께 사용해야 최신의 완전한 기록을 구분할 수 있다.

