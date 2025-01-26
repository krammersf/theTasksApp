# The Tasks App Project

This project consists of a backend developed in dotNET (C#) and a frontend developed in Angular.

## Project Structure

The backend was developed using dotNET (C#).
The frontend was developed using Angular.

## Demo

A demonstration video of the project functionality is available below:

Click [here](https://www.youtube.com/watch?v=m1ojcssGwEo) to watch the video directly.

## Fast run

To quickly set up and run both the backend and frontend, you can use the provided `run.py` script (Mac m2). Follow the steps below:

1. Ensure you have Python 3 installed on your machine.

2. Open a terminal and navigate to the root directory of the project:
    ```sh
    cd /path/to/theTasksApp
    ```

3. Run the [run.py](http://_vscodecontentref_/2) script:
    ```sh
    python3 run.py
    ```

4. The script will automatically set up and start both the backend and frontend servers. You will see the following messages once they are running:
    ```
    Backend is running at http://localhost:5288/swagger/index.html
    Frontend is running at http://localhost:4200
    ```

5. To stop the backend and frontend processes, press Enter in the terminal where the script is running.



## Backend

To set up and run the backend, follow the steps below:

1. Clone this project and name it `theTasksApp`.

2. Navigate to the project:
    ```sh
    cd theTasksApp
    ```

3. Navigate to the backend:
    ```sh
    cd Backend-theTasksApp
    ```

4. Add the required packages:
    ```sh
    dotnet restore
    ```

5. Create and update the database:
    ```sh
    dotnet ef database update
    ```

6. Build and run the project:
    ```sh
    dotnet build
    dotnet run
    ```

7. Access the API documentation:
    ```
    http://localhost:5288/swagger/index.html
    ```

## Frontend

To set up and run the frontend, follow the steps below:

1. Navigate to the frontend:
    ```sh
    cd Frontend-theTasksApp
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Run the server:
    ```sh
    ng serve
    ```

4. Access the application:
    ```
    http://localhost:4200
    ```

## Contribution

krammersf
