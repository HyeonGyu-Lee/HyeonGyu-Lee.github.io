---
layout: default
title: Arrays & Two Pointers
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-21-10-00
nav_order: 2
parent: 'Coding Test in C'
permalink: '/Coding_Test_in_C/Arrays_&_Two_Pointers'
redirect_from:
 - /3f91b412900a81f48b08c6abf5aa2600
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Problem


오름차순 정렬된 배열에서 합이 target인 서로 다른 두 원소가 있는지 찾는다. 같은 값을 가진 서로 다른 인덱스는 허용한다. 정렬 전제가 없으면 먼저 정렬하고 비용·원본 인덱스 보존을 고려한다.


## Invariant


양끝 합이 작으면 왼쪽 값을 증가시키고, 크면 오른쪽 값을 감소시킨다. 정렬되어 있으므로 제외한 후보에서는 해가 나올 수 없다. 시간 O(n), 추가 공간 O(1)이다.


```c
#include <assert.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
static bool pair_sum(const int32_t *a, size_t n, int64_t target) {
    if (n < 2) return false;
    size_t left=0, right=n-1;
    while (left < right) {
        int64_t sum=(int64_t)a[left]+a[right];
        if (sum == target) return true;
        if (sum < target) ++left; else --right;
    }
    return false;
}
int main(void) {
    const int32_t a[]={-5,1,3,3,9};
    assert(pair_sum(a,5,6));
    assert(pair_sum(a,5,4));
    assert(!pair_sum(a,5,100));
    assert(!pair_sum(a,1,-10));
    return 0;
}
```



## Extension


정렬되지 않은 부분 배열의 합 문제는 이 방법과 다르다. Sliding Window는 양수·비음수 조건처럼 단조성이 있어야 적용되는 경우가 많다. 음수가 있으면 Prefix Sum과 hash 등 다른 접근을 검토한다.

