步骤:
    1. 添加 inputVisible 这个数据(在添加属性值列表的时候,同时加上这个数据) - ts限制类型中也需加
    2. 通过模板中点击div和input失焦 来 切换 inputVisible 的值
    3. 在input失焦的时候  inputVisible为false  input隐藏的时候,做了限制条件
      3.1 当输入内容为空的时候,把之前的添加的新数据干掉
      3.2 当输入内容和已存在内容重复的时候,,把之前的添加的新数据干掉
      3.3 然后让 inputVisible变为false
    4. 在聚焦的时候 - 点击div的时候,新增数据的时候也应该自动聚焦
      使用 nextTick 等待DOM更新完毕之后,才能获取到input框 然后调用聚焦