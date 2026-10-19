---
layout: default
title: Linker Script & Startup
has_children: false
published_date: 2026-10-14-22-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 2
parent: 'Memory Architecture'
permalink: '/MCU_Peripheral/Memory_Architecture/Linker_Script_&_Startup'
redirect_from:
 - "/3f91b412900a818892aac82a6b1d2b38"
---
## ELF는 빌드되지만 부팅 직후 상태값이 잘못되는 상황


Linker는 section의 주소를 정하고 startup은 초기값 복사와 zero initialization을 수행한다. Load address와 runtime address의 관계를 알아야 .data, .bss와 retained 영역을 설명할 수 있다.


> Compiler는 section을 만들고 Linker는 주소와 region을 결정하며 Startup은 C runtime이 요구하는 상태를 준비한다. 소스에 전역변수가 있다는 사실만으로 최종 RAM 배치가 확정되지 않는다. 최종 ELF와 map file로 확인한다.


## Sections


.text는 code, .rodata는 상수, .data는 초기값이 있는 mutable 데이터, .bss는 zero 초기화 데이터의 일반적인 이름이다. 최적화·toolchain·section attribute에 따라 달라질 수 있다. 초기화된 .data는 Flash load address와 RAM run address가 서로 다를 수 있다.


## Startup Sequence


reset entry → stack/필수 CPU 설정 → vendor RAM/ECC 초기화 → .data copy → .bss zero → runtime 초기화 → main이 전형적 흐름이다. 구체적인 순서와 예외는 제공된 startup code를 따른다. Bootloader handover 시 이 초기화가 다시 수행되는지도 확인한다.


## Build Inspection


```bash
# GNU Arm 도구체인이 설치된 환경, 실제 ELF 파일로 치환
arm-none-eabi-size firmware.elf
arm-none-eabi-readelf -S firmware.elf
arm-none-eabi-nm -S --size-sort firmware.elf
arm-none-eabi-objdump -h firmware.elf
```



## Layout Review


map file에서 vector table, boot metadata, application entry, DMA buffer, stack/heap 한계와 예약 영역 겹침을 확인한다. 사용되지 않는 section의 제거 옵션과 vector/registration section의 KEEP 필요 여부를 확인한다. memory region overflow 경고를 억제하지 않는다.


## Retained State


.noinit 같은 별도 section은 linker와 startup이 실제로 초기화를 생략하도록 구성되어야 한다. 이름만 붙이면 retention이 보장되지 않는다. retained data에는 magic·version·length·검증 정보를 두고 power-on 후 쓰레기 값을 정상 상태로 해석하지 않는다.


## Verification


초기값 있는 전역·zero 전역·const·큰 배열의 map 배치를 비교한다. cold/warm reset에서 값이 요구대로 초기화되는지 관찰한다. 실제 메모리 주소가 맞는지 검증하지 않은 예제 linker script를 보드에 적용하지 않는다.


## 이해를 확인하는 질문


> 전역 초기값은 Flash에서 직접 읽히는가?


일반적인 .data는 Flash의 초기 이미지를 RAM으로 복사한 뒤 사용한다. Linker 배치와 startup code를 함께 확인한다.

