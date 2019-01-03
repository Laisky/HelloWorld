import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Input{
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        char c;
        do {
            c = (char) br.read();
            System.out.print(c);
        }while(c!='q');
    }
}
