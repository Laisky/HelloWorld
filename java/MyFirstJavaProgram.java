public class MyFirstJavaProgram {

    public static void main(String []args) {
       System.out.println("Hello World");
       SubClass.New().output("output by internal method");
    }
}


class SubClass {
    void output(String val) {
        System.out.println(val);
    }

    public static SubClass New() {
        return new SubClass();
    }
}
