---
layout: default
title: "Dynamic Programming"
has_children: false
published_date: 2026-10-14T12:53:00.000Z
last_modified_date: 2026-10-14T12:54:00.000Z
nav_order: 5
parent: "Coding Test in C"
permalink: '/Coding_Test_in_C/Dynamic_Programming'
redirect_from:
 - "/3f91b412900a81529862ddf04ee2af17"
---

## 부분 문제의 결과를 재사용해 최적값을 구하는 상황

State는 필요한 과거 정보를 압축하고 transition은 가능한 선택을 연결한다. 초기값과 불가능 상태를 분리해야 최소·최대 계산에서 잘못된 경로가 섞이지 않는다.

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

## 이해를 확인하는 질문

> 배열만 만들면 dynamic programming이 되는가?

State의 의미, transition 의존 관계와 계산 순서가 먼저 정의되어야 한다. 저장은 중복 계산을 줄이는 수단이다.
