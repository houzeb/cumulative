import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  //此小部件是应用程序的根目录。
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        //这是您的应用程序的主题。
        //尝试使用“flutter run”运行应用程序。 你会看到的
        //应用程序有一个蓝色工具栏。 然后，在不退出应用程序的情况下，尝试
        //将下面的primarySwatch更改为Colors.green，然后调用
        //“热重载”（在你跑“颤动”的控制台中按“r”，
        //或者只是将更改保存到Flutter IDE中的“热重载”。
        //请注意，计数器没有重置为零; 应用程序
        //未重新启动。
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  //此小部件是应用程序的主页。 这是有状态的，意思
  //它有一个State对象（在下面定义），其中包含影响的字段
  //它看起来如何

  //此类是状态的配置。 它保留了价值（在此
  //案例标题）由父母提供（在本例中为App小部件）和
  //由State的构建方法使用。 Widget子类中的字段是
  //始终标记为“最终”。

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      //这个对setState的调用告诉Flutter框架有什么东西
      //在此状态中更改，这会导致它重新运行下面的构建方法以便显示可以反映更新的值。 
      //如果我们改变了_counter没有调用setState（），那么构建方法就不会
      //再次调用，所以似乎没有任何事情发生。
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    //每次调用setState时都会重新运行此方法，例如已完成通过上面的_incrementCounter方法。
    // Flutter框架已经过优化，可以重新运行构建方法快，所以你可以重建任何需要更新的东西
    //而不是必须单独更改小部件的实例。
    return Scaffold(
      appBar: AppBar(
      //这里我们从App.build方法创建的MyHomePage对象中获取值，并使用它来设置我们的appbar标题。
        title: Text(widget.title),
      ),
      body: Center(
      // Center是一个布局小部件。 它需要一个孩子并将其定位在父母的中间。        
      child: Column(
          //列也是布局小部件。 需要一份儿童和一份清单垂直排列 默认情况下，它自身的大小适合它
          //儿童水平，并试图与其父母一样高。
          //调用“debug painting”（在控制台中按“p”，
          //选择Android中的Flutter Inspector中的“Toggle Debug Paint”操作Studio，
          //或Visual Studio Code中的“Toggle Debug Paint”命令）
          //查看每个小部件的线框。
          // Column具有各种属性来控制它自身的大小和它如何定位其子女 
          //这里我们使用mainAxisAlignment来垂直居中; 
          //这里的主轴是垂直的轴因为列是垂直的（横轴是水平）。
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ), //这个尾随逗号使构建方法的自动格式更好。
    );
  }
}
