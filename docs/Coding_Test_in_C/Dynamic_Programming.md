---
layout: default
title: Dynamic Programming
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-21-10-00
nav_order: 5
parent: 'Coding Test in C'
permalink: '/Coding_Test_in_C/Dynamic_Programming'
redirect_from:
 - /3f91b412900a81529862ddf04ee2af17
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Problem


정해진 양의 동전 값으로 금액을 만드는 최소 동전 수를 구한다. 각 동전은 반복 사용할 수 있다. Greedy는 동전 체계에 따라 실패하므로 성립 조건 없이 적용하지 않는다.


## State and Transition


dp[x]는 금액 x의 최소 동전 수다. dp[0]=0, 나머지는 INF로 시작하고 dp[x]=min(dp[x],dp[x-coin]+1)로 갱신한다. 시간 O(amount×coin_count), 공간 O(amount)이다.


```c
#include <assert.h>
#include <stddef.h>
#define LIMIT 20
#define INF 1000000
static int min_coins(const int *coins, size_t n, int amount) {
    assert(amount>=0 && amount<=LIMIT);
    int dp[LIMIT+1]; dp[0]=0;
    for (int x=1;x<=amount;++x) {
        dp[x]=INF;
        for (size_t i=0;i<n;++i) {
            assert(coins[i]>0);
            if (coins[i]<=x && dp[x-coins[i]]!=INF &&
                dp[x-coins[i]]+1<dp[x]) dp[x]=dp[x-coins[i]]+1;
        }
    }
    return dp[amount]==INF ? -1 : dp[amount];
}
int main(void) {
    const int a[]={1,3,4}, b[]={2,4};
    assert(min_coins(a,3,6)==2);
    assert(min_coins(b,2,3)==-1);
    assert(min_coins(a,3,0)==0);
    return 0;
}
```



## Review


순서를 세는 문제와 조합 수를 세는 문제는 반복문 순서에 따라 달라질 수 있다. 최소 개수와 경우의 수도 다른 상태 정의가 필요하다. 작은 입력을 완전 탐색해 DP 결과와 비교한다. assert는 여기서 전제 검사이며 외부 입력 검증을 대신하지 않는다.

