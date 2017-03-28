p2p$.ns('com.test');
p2p$.com.test.Person = CdeBaseClass.extend_({
    init: function(name) {
        this.name = name;
        this.age = 20;
    },
    getName_: function(prefix) {
        return prefix + this.name;
    }
});

p2p$.com.test.Employee = p2p$.com.test.Person.extend_({
    init: function(name, employeeID) {
        //  调用父类的方法
        this._super(name);
        this.employeeID = employeeID;
    },
    getEmployeeIDName: function() {
        // 注意：我们还可以通过这种方式调用父类中的其他函数
        var name = this._superprototype.getName_.call(this, "Employee name: ");
        return name + ", Employee ID: " + this.employeeID;
    },
    getName_: function() {
        //  调用父类的方法
        return this._super("Employee name: ");
    }
});