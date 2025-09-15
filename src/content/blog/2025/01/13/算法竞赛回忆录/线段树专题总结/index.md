---
title: 线段树专题总结
description: 线段树数据结构的详细学习总结，包含基本原理、代码实现和相关题目的解题思路。
pubDate: 2020-08-24
tags: 
  - 算法竞赛
  - 数据结构
  - 线段树
category: 生活碎片
author: 日奈

hidden: true
math: true
---


## 线段树
##### 线段树是一种二叉搜索树,与区间树相似,它将一个区间划分成一些单元区间,每个单元区间对应线段树中的一个叶结点.
##### 使用线段树可以快速的查找某一个节点在若干条线段中出现的次数,时间复杂度为$O(logN)$,而未优化的空间复杂度为2N,实际应用时一般还要开4N的数组以免越界,因此有时需要离散化让空间压缩.
--摘自[百度百科](https://baike.baidu.com/item/%E7%BA%BF%E6%AE%B5%E6%A0%91)  
线段树的机理还是比较好理解的.
![image](https://bkimg.cdn.bcebos.com/pic/bd3eb13533fa828bcb5fe85ffe1f4134970a5a09?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5)  
查询某个区间,需要将其划分成许多小区间,若区间左右端点与线段树节点左右端点一致,就可以返回结果.  
```cpp
int query(int l,int r,int p)
{
    if(tree[p].l==l&&tree[p].r==r)
        return tree[p].sum;
    int mid=tree[p].l+tree[p].r>>1;
    if(r<=mid)return query(l,r,ls);
    else if(l>mid)return query(l,r,rs);
    else return query(l,mid,ls)+query(mid+1,r,rs);
}
```
最经典的区间求和代码.  
三条if-else语句的意思大概是:  

1. 如果区间的右端点比左儿子的右端点小,则区间被完全包含在左儿子中,查询左儿子.
2. 如果区间的左端点比右儿子的左端点大,则区间被完全包含在右儿子中,查询右儿子.
3. 否则,区间被左右儿子平分秋色,将左右儿子查询结果融合.
4. 最终结果是区间左右端点与节点左右端点一致时,返回这个儿子的值.  

这就是最经典的区间求和的的代码啦.  
```cpp
void update(int x,int a,int p)
{
    if(tree[p].l==tree[p].r)
    {
        tree[p].sum=a;
        return ;
    }
    int mid=tree[p].l+tree[p].r>>1;
    if(x<=mid)update(x,a,ls);
    else update(x,a,rs);
    Up(p);
}
```
单点更新的代码如上,也是判断这个单点在线段树节点中的位置,并进行向上更新,即Push_up:`tree[p].sum=tree[ls].sum+tree[rs].sum`  
完整的单点更新,区间求和代码
```cpp
#include<cstdio>
#define ls (p<<1)
#define rs (p<<1|1)
const int maxn=1e5+5;
struct T
{
    int l,r,sum;
}tree[maxn<<2];
int a[maxn],n,m;
void Up(int p)
{
    tree[p].sum=tree[ls].sum+tree[rs].sum;
}
void build(int l,int r,int p)
{
    tree[p].l=l;tree[p].r=r;
    if(l==r)
    {
        tree[p].sum=a[l];
        return ;
    }
    int mid=l+r>>1;
    build(l,mid,ls);
    build(mid+1,r,rs);
    Up(p);
}
int query(int l,int r,int p)
{
    if(tree[p].l==l&&tree[p].r==r)
        return tree[p].sum;
    int mid=tree[p].l+tree[p].r>>1;
    if(r<=mid)return query(l,r,ls);
    else if(l>mid)return query(l,r,rs);
    else return query(l,mid,ls)+query(mid+1,r,rs);
}
void update(int x,int a,int p)
{
    if(tree[p].l==tree[p].r)
    {
        tree[p].sum=a;
        return ;
    }
    int mid=tree[p].l+tree[p].r>>1;
    if(x<=mid)update(x,a,ls);
    else update(x,a,rs);
    Up(p);
}
int main()
{
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;++i)
        scanf("%d",&a[i]);
    char tmp[10];
    build(1,n,1);
    while(m--)
    {
        int x,y;
        scanf("%s%d%d",tmp,&x,&y);
        if(tmp[0]=='Q')
            printf("%d\n",query(x,y,1));
        else update(x,y,1);
    }
}
```
区间更新怎么办呢,难道要将区间的一个个单点扫过来吗?不,我们可以像区间求和一样去更新一个个小区间.但是我们到`if(tree[p].l==l&&tree[p].r==r)`的时候就会return了.此时我们引入一个新思想----**懒标记**  
当我们在$[L,R]$这个区间return的时候,我们给$[L,R]$这个节点传上一个懒标记,以后访问到这个节点的时候,再进行向下更新,更新儿子节点的值.
```cpp
void Down(int p)
{
    if(tree[p].lazy==0)return;
    ll &t=tree[p].lazy;
 
    tree[ls].lazy+=t;
    tree[ls].sum+=t*(tree[ls].R-tree[ls].L+1);
 
    tree[rs].lazy+=t;
    tree[rs].sum+=t*(tree[rs].R-tree[rs].L+1); 
    t=0; 
}
void update(int L,int R,int a,int p)
{
    if(tree[p].L==L&&tree[p].R==R)
    {
        tree[p].lazy+=a;
        tree[p].sum+=a*(R-L+1);
        return;
    }
    Down(p);
    int mid=(tree[p].L+tree[p].R)>>1;
    if(R<=mid)update(L,R,a,ls);
    else if(L>mid)update(L,R,a,rs);
    else update(L,mid,a,ls),update(mid+1,R,a,rs);
    Up(p);
}
ll query(int L,int R,int p)
{
    if(tree[p].L==L&&tree[p].R==R)
        return tree[p].sum;
    Down(p);
    int mid=(tree[p].L+tree[p].R)>>1;
    if(R<=mid) return query(L,R,ls);
    else if(L>mid)return query(L,R,rs);
    else return query(L,mid,ls)+query(mid+1,R,rs);
} 
```
在一切访问到节点的时候向下更新就可以啦.  
线段树不但可以解决区间求和问题,还可以解决区间最值问题(将sum的更新改为max和min值的更新就可以了),区间连续和问题(存从左开始的连续和,从右开始的连续和,以及最大连续和,和分治思想类似,需要从儿子up答案),区间存在问题(在线段树上二分,存在的区间)等等...  
涉及到前缀的都可以先想树状数组,涉及到区间的再想线段树就可以了.  
为什么呢?
### 线段树的常数太他妈大了,爷$O(nlog^2(n))$的树状数组比他们$O(nlog(n))$的线段树还快,爷的线段树的时间可以达到树状数组的四倍,用线段树之前想想能不能用树状数组,不然是找TLE的吗?
## 专题题目
### [A.HDU 1166](http://acm.hdu.edu.cn/showproblem.php?pid=1166)  
线段树板子题,单点更新区间求和.  
### [B.HDU 1754](http://acm.hdu.edu.cn/showproblem.php?pid=1754)  
线段树板子题,单点更新区间求最值.  
### [C.POJ 3468](http://poj.org/problem?id=3468)  
线段树板子题,区间更新区间求和.  
### [D.HDU 2665](http://acm.hdu.edu.cn/showproblem.php?pid=2665)  
归并树,线段树内存有序的vector,进行归并.在外部二分查找符合的数,在vector内二分寻找比x小的数.有点卡常,垃圾题目  
### [E.HDU 2795](http://acm.hdu.edu.cn/showproblem.php?pid=2795)  
线段树上二分,找第一个$>x$的点,当h比n大的时候,多余的h是没用的,可以舍去  
### [F.HihoCoder 1079](https://hihocoder.com/problemset/problem/1079)  
线段树上区间覆盖,离散化注意左右端点就可以了(203数据真水)
### [G.POJ 2452](http://poj.org/problem?id=2452)  
枚举左端点，发现题目所求的答案是不符合二分答案的性质的，但是可以二分找到一段数值全部大于左端点的区间，在这段区间内找最大的数值的位置。
### [H.HDU 3308](http://acm.hdu.edu.cn/showproblem.php?pid=3308)  
可修改的最大连续和,要判断边界是否可以满足最大连续和的要求就可以了
### [I.SPOJ 1716 GSS3](https://www.spoj.com/problems/GSS3/en/)
最大连续和,比H还简单
### [J.POJ 2892](http://poj.org/problem?id=2452)  
别人在线段树上二分的代码我看不懂,所以就写了一个在外面二分,找该节点最左边界和最右边界.时间复杂度$O(nlog^2(n))$,树状数组跑的飞快,比他们线段树上二分跑的还快,线段树是刚好卡过去的.
### [K.POJ 3667](http://poj.org/problem?id=3667)
线段树上二分.找第一个最大连续和出现的位置
### [L.SPOJ 2916 GSS5](https://www.spoj.com/problems/GSS5/en/)  
相交的部分与不相交的部分分别判,就可以轻松A掉这道nt最大连续和  
### [M.HDU 5141](http://acm.hdu.edu.cn/showproblem.php?pid=5141)
离散化数值后建一棵权值线段树,在$[1,A[i]-1]$中查找最长子序列$lis$,再以此$lis+1$ 更新$A[i]$节点.对于一个$lis$,记录他的长度与起始位置,便于记录答案.
### [N.POJ 1769](http://poj.org/problem?id=1769)
挺水的一道dp,离散化也不用.用线段树找到当前区间之前的存的最小值,然后再更新右端点的最小值就可以了
### [O.HDU 2871](http://acm.hdu.edu.cn/showproblem.php?pid=2871) [P.BZOJ 1858](https://darkbzoj.tk/problem/1858)
没什么好说的纯模拟.  
[专题代码](http://private.vjudge.net/contest/324532#status/Ri_Nai/-/1/)
