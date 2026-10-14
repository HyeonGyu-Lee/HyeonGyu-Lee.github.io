---
layout: default
title: Boot & Device Tree
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-21-10-00
nav_order: 2
parent: 'Embedded Linux'
permalink: '/Embedded_Linux/Boot_&_Device_Tree'
redirect_from:
 - /3f91b412900a8121ba75f8d2e09b90a8
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Boot Flow


```mermaid
flowchart LR
 R[Boot ROM] --> B[Bootloader]
 B --> K[Kernel + DTB]
 K --> F[Root Filesystem]
 F --> I[Init / Service Manager]
 I --> A[Application]
```



## Responsibilities


Bootloader는 보드에 필요한 초기화와 이미지 로딩·검증을 수행한다. Kernel은 메모리·스케줄링·driver를 초기화하고 Root Filesystem에서 첫 user process를 실행한다. initramfs 사용 여부와 상세 순서는 BSP마다 다르다.


## Device Tree


Device Tree는 하드웨어 연결과 속성을 기술한다. compatible, reg, interrupts, clocks, pinctrl, status 등이 driver binding에 사용된다. DTS를 수정한다고 없는 driver가 만들어지지는 않는다. 잘못된 주소·핀·클록을 복사하지 말고 보드 schematic과 binding 문서를 확인한다.


## Read-only Inspection


```bash
uname -a
cat /proc/cmdline
cat /proc/mounts
cat /proc/interrupts
# systemd를 사용하는 이미지에서
journalctl -b -k
systemctl --failed
```



## Bring-up Procedure


UART console에서 Bootloader·Kernel·user service 중 어느 단계에서 실패하는지 나눈다. driver probe 실패라면 DT compatible, clock/regulator 공급, pinmux, 권한과 device node를 확인한다. Root FS mount 실패와 application crash를 같은 문제로 취급하지 않는다.


## Image Management


Kernel, DTB, Modules, Root FS와 application version의 조합을 기록한다. 재현 가능한 BSP 빌드와 Artifact 서명·배포 정책을 사용한다. Bootloader 변경은 정상 부팅 경로와 복구 인터페이스를 준비한 보드에서 검증한다.

