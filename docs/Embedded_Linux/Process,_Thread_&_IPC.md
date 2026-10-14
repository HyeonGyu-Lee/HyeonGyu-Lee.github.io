---
layout: default
title: Process, Thread & IPC
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 3
parent: 'Embedded Linux'
permalink: '/Embedded_Linux/Process,_Thread_&_IPC'
redirect_from:
 - /3f91b412900a81f5bdeaca2cefa7b4c5
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


> Process는 독립적인 virtual address space를 가지며 Thread는 같은 Process의 메모리를 공유한다. Thread를 늘리면 shared state와 synchronization 문제가 생긴다. fork 이후 실행, exec, exit, wait와 thread 종료·join의 역할을 구분한다.


## IPC Selection


Pipe는 연결된 byte stream, Unix Domain Socket은 로컬 프로세스 통신, TCP/UDP는 네트워크 통신, Shared Memory는 복사를 줄일 수 있는 공유 영역이다. Shared Memory 자체는 동기화나 메시지 경계를 제공하지 않는다.


## POSIX C: Partial Write Handling


다음 함수는 blocking file descriptor를 전제로 한다. nonblocking fd의 EAGAIN은 poll/epoll과 deadline으로 별도 처리해야 하며, socket의 SIGPIPE 정책도 별도로 정한다.


```c
#include <errno.h>
#include <stddef.h>
#include <unistd.h>
int write_all(int fd, const void *data, size_t size) {
    const unsigned char *p = data;
    while (size != 0) {
        ssize_t n = write(fd, p, size);
        if (n < 0) { if (errno == EINTR) continue; return -1; }
        if (n == 0) { errno = EIO; return -1; }
        p += (size_t)n;
        size -= (size_t)n;
    }
    return 0;
}
```



## Cancellation and Shutdown


작업 thread 중단 요청 → blocking I/O 해제 → Queue 종료 → join → 자원 해제 순서를 설계한다. signal handler에서는 async-signal-safe 함수만 사용하며 복잡한 logging·malloc·mutex 처리 대신 flag 또는 안전한 알림 경로를 사용한다.


## Verification


partial read/write, EINTR, peer 종료, Queue full, shutdown 중 callback, file descriptor 누수를 시험한다. TCP recv 한 번이 메시지 하나라는 가정을 하지 않는다. 길이·framing·상한·timeout을 application protocol에 정의한다.

