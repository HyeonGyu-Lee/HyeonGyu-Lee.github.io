---
layout: default
title: Complexity & C Safety
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-21-10-00
nav_order: 1
parent: 'Coding Test in C'
permalink: '/Coding_Test_in_C/Complexity_&_C_Safety'
redirect_from:
 - /3f91b412900a81e0a23bdf42c8364019
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Complexity


n=100000에서 O(n²)는 대개 후보에서 제외하고 정렬 O(n log n), hash·two pointers O(n) 등을 검토한다. 시간 제한은 언어·상수·입출력·환경에 따라 다르므로 단순 연산 횟수만으로 보장하지 않는다.


## Integer and Memory


합·곱의 중간 계산부터 충분한 폭을 사용한다. int64_t 변수에 대입하더라도 int×int 단계에서 이미 overflow가 발생할 수 있다. 크기 계산에서는 SIZE_MAX와 곱셈 overflow를 확인한 뒤 할당하고 실패를 처리한다.


## Common Traps


qsort comparator에서 return a-b는 overflow 위험이 있다. (a\>b)-(a\<b) 형태를 사용한다. 배열 밖 접근, 음수 인덱스, 해제 후 접근, 종료 문자가 없는 문자열, scanf 변환 개수 무시를 점검한다. 깊은 재귀는 stack 제한 때문에 iterative 방식이 필요할 수 있다.


## Test Matrix


빈 입력 허용 여부, 한 원소, 전부 동일, 정렬·역정렬, 최솟값·최댓값, 해 없음·복수 해를 시험한다. 작은 무작위 입력에서는 단순 해법과 최적화 해법을 비교하는 differential test가 유용하다.


## Review Questions


복잡도에 출력 크기와 정렬 비용이 포함됐는가? 입력을 수정해도 되는가? 함수가 포인터를 반환하면 수명은 누가 관리하는가? 데이터 구조의 capacity 초과를 어떻게 처리하는가?

