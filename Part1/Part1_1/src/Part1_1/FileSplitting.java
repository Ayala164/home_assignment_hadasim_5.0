package Part1_1;

import java.io.*;
import java.util.*;

public class FileSplitting {

    public static void splitFile(String inputFilePath, int linesPerFile) throws IOException {
    	BufferedReader reader = new BufferedReader(new FileReader(inputFilePath));
        List<String> lines = new ArrayList<>();
        String line;

       
        while ((line = reader.readLine()) != null) {
            lines.add(line);
        }
        reader.close();

        int fileCount = 1;
        for (int i = 0; i < lines.size(); i += linesPerFile) {
            String outputFilePath = "output_" + fileCount + ".txt";
            BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilePath));
            
            for (int j = i; j < i + linesPerFile && j < lines.size(); j++) {
                writer.write(lines.get(j));
                writer.newLine();
            }

            writer.close();
            fileCount++;
        }

        System.out.println("הקובץ פוצל בהצלחה!");
    }
}