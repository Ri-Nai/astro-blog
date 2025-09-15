---
title: "Test 66 2020.8.31 下午考试总结"
description: "2020年8月31日下午考试的题目分析和解题思路总结，包含BFS、贪心算法等题目的详细解答。"
pubDate: 2020-08-31
tags: 
  - 算法竞赛
  - 题解
  - BFS
  - 贪心算法
category: 生活碎片
author: "日奈"

hidden: true
math: true
---
## T1 P1668

不想写简洁了,把六个方向都枚举一遍就行啦

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=505,dx[]={1,0,-1,0},dy[]={0,1,0,-1};
struct node{int x,y,step;};
int n,ans[N*N],L[N][N],R[N][N],vis[N][N],id[N][N],cnt;
queue<node>Q;
bool pd(int x,int y)
{
    return x<=n&&y<=(n-1+(x&1))&&x>=1&&y>=1&&!vis[x][y];
}
inline void PUSH(int x,int y,int step)
{
    Q.push((node){x,y,step});
    vis[x][y]=1;
}
void bfs()
{
    memset(ans,-1,sizeof ans);
    Q.push((node){1,1,1});
    vis[1][1]=1;
    while(!Q.empty())
    {
        node p=Q.front();Q.pop();
        int x=p.x,y=p.y,step=p.step,k=x&1;
        ans[id[x][y]]=step;
 
        if(pd(x,y+1)&&R[x][y]==L[x][y+1])PUSH(x,y+1,step+1);
        if(pd(x,y-1)&&L[x][y]==R[x][y-1])PUSH(x,y-1,step+1);
 
        if(pd(x+1,y+1-k)&&R[x][y]==L[x+1][y+1-k])PUSH(x+1,y+1-k,step+1);
        if(pd(x-1,y+1-k)&&R[x][y]==L[x-1][y+1-k])PUSH(x-1,y+1-k,step+1);
 
        if(pd(x+1,y-k)&&L[x][y]==R[x+1][y-k])PUSH(x+1,y-k,step+1);
        if(pd(x-1,y-k)&&L[x][y]==R[x-1][y-k])PUSH(x-1,y-k,step+1);
    }
}
int main()
{
    scanf("%d",&n);
    for(int i=1;i<=n;++i)
    {
        int len=(n-1)+(i&1);
        for(int j=1;j<=len;++j)
            scanf("%d%d",&L[i][j],&R[i][j]),id[i][j]=++cnt;
    }
    bfs();
    for(int i=cnt;i;--i)
        if(~ans[i])return printf("%d\n",ans[i]),0;
}
```

## T2 P1669

还是一道BFS  
可以在两点之间将空间站作为一个虚点  
考试的时候乱写了一下~~直接用了Vector~~  

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e5+5;
bool vis[N],mark[N];
int n,m,k;
vector<int>E[N],to[N];
int bfs()
{
    queue<pair<int,int> >Q;
    Q.push(make_pair(1,1));
    while(!Q.empty())
    {
        int u=Q.front().first,step=Q.front().second;
        Q.pop();if(u==n)return step;
        for(int i=0;i<to[u].size();++i)
        {
            int &f=to[u][i];
            if(mark[f])continue;
            mark[f]=1;
            for(int j=0;j<E[f].size();++j)
            {
                int &v=E[f][j];
                if(!vis[v]&&(vis[v]=1))
                    Q.push(make_pair(v,step+1));
            }
        }
    }
    return -1;
}
int main()
{
    scanf("%d%d%d",&n,&k,&m);
    for(int i=1;i<=m;++i)
    {
        for(int j=1,u;j<=k;++j)
        {
            scanf("%d",&u);
            to[u].push_back(i);
            E[i].push_back(u);
        }
    }
    printf("%d\n",bfs());
}
```

## T3 P2620

一道倍增的题目  
你可以计算出每个点跳$2^k$步能到哪一行  
然后每次都这么倍增跳就行了  
~~只有一个点属实毒瘤~~  
~~写了一个除法算跳到的位置也属实脑瘫~~

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e5+5;
int n,W,lw,ww,rw,A[N],num,cnt;
int nL[N],to[N],RnL[N],bz[25][N];//需要多少行,能到达哪里
long long sum[N];
void move(int i,int *nL)
{
    if(num+A[i]<=W)nL[i]=cnt,num+=A[i]+1;
    else num=A[i]+1,nL[i]=++cnt;
}
void solve()
{
    scanf("%d%d%d%d",&n,&W,&ww,&lw);
    rw=W-lw-ww;memset(to,0,sizeof to);
    for(int i=1;i<=n;++i)
        scanf("%d",&A[i]),sum[i]=1+sum[i-1]+A[i];
    num=0;cnt=1;for(int i=1;i<=n;++i)move(i,nL);
    num=0;cnt=1;for(int i=n;i>=1;--i)move(i,RnL);
    for(int i=1;i<=n;++i)to[nL[i]]=i;
    for(int i=1;i<=n;++i)
    {
        int now=i;
        now=upper_bound(sum+now,sum+n+1,sum[now-1]+lw+1)-sum;
        now=upper_bound(sum+now,sum+n+1,sum[now-1]+rw+1)-sum;
        if(now==n+1)now=0;
        bz[0][i]=now;
    }
    for(int i=1;i<=20;++i)
        for(int j=1;j<=n;++j)
            bz[i][j]=bz[i-1][bz[i-1][j]];
    int Q;scanf("%d",&Q);
    for(int h,x;Q--;)
    {
        scanf("%d%d",&x,&h);
        if(x-1&&to[x-1]==0){printf("%d\n",nL[n]+h);continue;}
        int now=to[x-1]+1;
        if(now==n+1){printf("%d\n",x-1+h);continue;}
        for(int i=0;i<=20;++i)
            if(1<<i&h)now=bz[i][now];
        if(!now)printf("%d\n",x-1+h);
        else printf("%d\n",x-1+h+RnL[now]);
    }
}
int main()
{
    int T;scanf("%d",&T);
    while(T--)solve();
}
```

## T4 P1652

二分图最大匹配  
判断位置和值是否能匹配

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=205,M=4e4+5;
int n,Q,A[N],B[N],L[N],R[N],head[N]
,to[M],nxt[M],tot,match[N],as;
bool vis[N];
inline void Add(int u,int v)
{
    nxt[++tot]=head[u];
    to[head[u]=tot]=v;
}
bool dfs(int u)
{
    for(int i=head[u],v;(v=to[i]);i=nxt[i])
        if(!vis[v]&&(vis[v]=1)&&(!match[v]||dfs(match[v])))
            return match[v]=u;
}
int main()
{
    scanf("%d%d",&n,&Q);
    for(int i=1;i<=n;++i)L[i]=B[i]=1,R[i]=A[i]=n;
    for(int i=1,op,l,r,v;i<=Q;++i)
    {
        scanf("%d%d%d%d",&op,&l,&r,&v);
        L[v]=max(l,L[v]);R[v]=min(r,R[v]);
        if(op==1)for(int j=l;j<=r;++j)A[j]=min(v,A[j]);
        else     for(int j=l;j<=r;++j)B[j]=max(v,B[j]);
    }
    for(int i=1;i<=n;++i)
        for(int j=B[i];j<=A[i];++j)
            if(i>=L[j]&&i<=R[j])Add(j,i);
    for(int i=1;i<=n;++i)
    {
        memset(vis,0,sizeof vis);
        if(!dfs(i))return !puts("-1");
    }
    for(int i=1;i<=n;++i)printf("%d ",match[i]);
}
```

## T5 P1677

一道比较ex,比较阴间的题目   
每个细菌是独立的,并且都有自己运动的循环节.  
而且每个细菌到$(x,y)$这个坐标可能有4个方向的情况  
我们把循环节的长度设为$k$,到达$(x,y)$这个点的循环点内的时间为$b$  
则有$k(5)$条方程  
$$
\begin{cases}
k_1x+b_1=t\newline
k_2x+b_2=t\newline
k_3x+b_3=t\newline
k_4x+b_4=t\newline
k_5x+b_5=t\newline
\end{cases}\newline
也就是\newline
\begin{cases}
k_1x+b_1=k_2x+b_2\newline
k_2x+b_2=k_3x+b_3\newline
k_3x+b_3=k_4x+b_4\newline
k_4x+b_4=k_5x+b_5\newline
\end{cases}
$$


```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long LL;
const int N=55,M=10;const LL inf=1e18;
const int dx[]={1,0,-1,0},dy[]={0,-1,0,1};
int n,m,K,tx,ty,X[M],Y[M],D[M],SL[M][N][N];
int Dir[265],cnt[M],Tm[M][M],Len[M];
bool vis[N][N][M];
LL K_[N],B_[N],B[N],ans=inf;
LL gcd(LL a,LL b){return b?gcd(b,a%b):a;}
LL lcm(LL a,LL b){return a/gcd(a,b)*b;}
void Exgcd(LL a,LL b,LL &x,LL &y)
{
    if(b)Exgcd(b,a%b,y,x),y-=a/b*x;
    else x=1,y=0;
}
bool ExCRT(LL &k1,LL k2,LL &b1,LL b2)
{
    LL G=gcd(k1,k2);
    LL L=lcm(k1,k2);
    LL d=b1-b2,x,y;
    if(d%G)return 1;
    Exgcd(k2,k1,x,y);
    LL x1=d/G*x%k1;
    b1=((k2*x1+b2)%L+L)%L;//b2是之前累计的答案
    k1=L;//k是累计的最小公倍数
    return 0;
}
inline bool pd(int x,int y)
{
    return x<=n&&y<=m&&x>=1&&y>=1;
}
void Move(int &x,int &y,int &d,int SL[N][N])
{
    if(SL[x][y])d=(d+SL[x][y])&3;
    if(!pd(x+dx[d],y+dy[d]))d^=2;
    x+=dx[d],y+=dy[d];
}
void GetAns()
{
    for(int i=1;i<=K;++i)K_[i]=Len[i],B_[i]=B[i];
    for(int i=2;i<=K;++i)
        if(ExCRT(K_[i],K_[i-1],B_[i],B_[i-1]))
            return;
    B_[K]=(B_[K]%K_[K]+K_[K])%K_[K];
    ans=min(ans,B_[K]);
}
void dfs(int id)
{
    if(id==K+1)return GetAns();
    for(int i=1;i<=cnt[id];++i)
        B[id]=Tm[id][i],dfs(id+1);
}
int main()
{
    Dir['D']=0;Dir['L']=1;
    Dir['U']=2;Dir['R']=3;
    scanf("%d %d %d",&n,&m,&K);
    scanf("%d %d",&tx,&ty);
    for(int i=1;i<=K;++i)
    {
        char d[N];
        scanf("%d %d %s",&X[i],&Y[i],d);
        D[i]=Dir[*d];
        for(int j=1;j<=n;++j)
        {
            scanf("%s",d);
            for(int k=1;k<=m;++k)
                SL[i][j][k]=(d[k-1]-'0')&3;
        }
    }
    for(int i=1;i<=10000;++i)//暴力寻找答案
    {
        bool flag=1;
        for(int j=1;j<=K;++j)
            if(X[j]!=tx||Y[j]!=ty){flag=0;break;}
        if(flag)return printf("%d\n",i),0;
        for(int j=1;j<=K;++j)Move(X[j],Y[j],D[j],SL[j]);
    }
    for(int i=1;i<=K;++i)//此时已经在循环节上
    {
        memset(vis,0,sizeof vis);
        int &x=X[i],&y=Y[i],&d=D[i];
        for(int j=1;;++j)
        {
            if(vis[x][y][d]&&(Len[i]=j-1))break;
            vis[x][y][d]=1;
            if(x==tx&&y==ty)Tm[i][++cnt[i]]=j;
            Move(x,y,d,SL[i]);
        }
    }
    dfs(1);
    printf("%lld\n",ans==inf?-1:ans+10000);
}
```

