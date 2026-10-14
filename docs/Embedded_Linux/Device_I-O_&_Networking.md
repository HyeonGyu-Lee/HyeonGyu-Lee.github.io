---
layout: default
title: Device I/O & Networking
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 4
parent: 'Embedded Linux'
permalink: '/Embedded_Linux/Device_I-O_&_Networking'
redirect_from:
 - /3f91b412900a81b79eaedd62648caf72
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


> User space 애플리케이션은 일반적으로 device node와 표준 API를 통해 하드웨어에 접근한다. 임의 MMIO 접근 대신 driver·권한·프로세스 소유권을 이용한다.


## Device Access


UART는 termios에서 baudrate·raw mode·flow control과 VMIN/VTIME을 설정한다. GPIO는 해당 kernel의 GPIO character device와 libgpiod 버전에 맞춰 사용한다. SPI spidev는 지원되는 device binding·권한과 transaction/CS 규칙이 필요하다. I2C는 장치 주소·register protocol을 데이터시트에 맞춘다.


## Network Inspection


```bash
ip -brief address
ip route
ip -details link show
ss -lntup
# CAN 장치가 있을 때
ip -details -statistics link show can0
```



## Nonblocking I/O


poll/epoll은 준비된 fd를 알려주며 완전한 application message를 보장하지 않는다. readiness 이후에도 partial I/O·EAGAIN·peer close를 처리한다. 하나의 event loop에서 느린 parsing이나 file 작업으로 다른 fd의 처리를 막지 않는다.


## Permissions


서비스에 필요한 device와 network 권한만 부여한다. 문제 해결을 위해 항상 root로 실행하는 대신 device group·service 설정·driver 접근 정책을 확인한다. 장치 재연결 후 이름·권한이 달라지는 조건도 검증한다.


## Verification


device unplug, interface down, bus error, 권한 부족, fd 재사용과 서비스 재시작을 시험한다. application queue의 timestamp와 실제 wire capture를 대조해 지연 위치를 찾는다.

