---
layout: default
title: "Binary Search"
has_children: false
published_date: 2026-10-14T12:52:00.000Z
last_modified_date: 2026-10-14T12:54:00.000Z
nav_order: 3
parent: "Coding Test in C"
permalink: '/Coding_Test_in_C/Binary_Search'
redirect_from:
 - "/3f91b412900a815ea22bfbb00013f19c"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Problem


정렬된 배열에서 target 이상인 첫 위치(lower_bound)를 찾는다. 없으면 n을 반환한다. 중복값을 처리해야 하므로 임의의 일치값 탐색과 구분한다.


## Invariant


답이 존재할 수 있는 구간을 [lo, hi)로 유지한다. mid 계산은 lo+(hi-lo)/2로 하고, 각 반복마다 구간이 줄어드는지 확인한다. 시간 O(log n), 추가 공간 O(1)이다.


```c
#include <assert.h>
#include <stddef.h>
static size_t lower_bound(const int *a, size_t n, int target) {
    size_t lo=0, hi=n;
    while (lo < hi) {
        size_t mid=lo+(hi-lo)/2;
        if (a[mid] < target) lo=mid+1;
        else hi=mid;
    }
    return lo;
}
int main(void) {
    const int a[]={1,3,3,8};
    assert(lower_bound(a,4,3)==1);
    assert(lower_bound(a,4,4)==3);
    assert(lower_bound(a,4,9)==4);
    assert(lower_bound(a,0,1)==0);
    return 0;
}
```



## Parametric Search


답의 범위를 이분 탐색하려면 feasible(x)가 단조적이어야 한다. 처리량·최소 시간 문제에서 이 조건을 먼저 증명하고 overflow 가능한 누적 합과 lo/hi의 의미를 정의한다.
