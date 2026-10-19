---
layout: default
title: Queue & Graph Traversal
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 4
parent: 'Coding Test in C'
permalink: '/Coding_Test_in_C/Queue_&_Graph_Traversal'
redirect_from:
 - "/3f91b412900a817c8aa4d5d8e0f4b62f"
---
## 연결된 node를 빠짐없이 방문하는 상황


Queue와 visited state는 탐색 순서와 중복 처리를 결정한다. 방문 표시 시점과 저장 공간의 한계가 correctness와 메모리 사용량을 바꾼다.


## Problem


가중치가 없는 그래프에서 시작점부터 각 정점까지의 최단 edge 수를 BFS로 계산한다. 가중치가 있으면 같은 BFS가 일반적으로 성립하지 않는다.


## Implementation


예제는 작은 고정 크기 adjacency matrix다. O(V²)이며 큰 sparse graph에서는 adjacency list로 O(V+E)를 목표로 한다. queue에 넣을 때 방문 표시하여 중복 삽입을 방지한다.


```c
#include <assert.h>
#include <stddef.h>
#define N 5
static void bfs(const unsigned char graph[N][N], size_t start, int dist[N]) {
    size_t q[N], head=0, tail=0;
    for (size_t i=0;i<N;++i) dist[i]=-1;
    assert(start<N);
    dist[start]=0; q[tail++]=start;
    while (head<tail) {
        size_t u=q[head++];
        for (size_t v=0;v<N;++v) {
            if (graph[u][v] && dist[v]<0) {
                dist[v]=dist[u]+1;
                assert(tail<N);
                q[tail++]=v;
            }
        }
    }
}
int main(void) {
    const unsigned char g[N][N]={
        {0,1,1,0,0},{1,0,0,1,0},{1,0,0,1,0},{0,1,1,0,0},{0}
    };
    int d[N]; bfs(g,0,d);
    assert(d[0]==0 && d[3]==2 && d[4]==-1);
    return 0;
}
```



## Extension


DFS는 연결 요소·cycle·topological 문제에 활용한다. directed/undirected cycle 판정은 다르다. 큰 입력의 recursion depth를 확인하고 필요한 경우 명시적 stack을 사용한다.


## 이해를 확인하는 질문


> Queue에 넣을 때와 꺼낼 때 방문 표시를 해도 같을까?


꺼낼 때만 표시하면 같은 node가 여러 번 들어갈 수 있다. 중복 허용과 queue 크기를 포함한 불변식을 정해야 한다.

