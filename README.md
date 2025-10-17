# TripLens

##  Running the Server

1. **Install dependencies**

```
clone the repo
cd Triplens
```

```
source env/bin/activate
```

```bash
pip install requirements.txt
```

2. **Run the API**

```bash
uvicorn api.main:app --host 0.0.0.0 --port 8080 --reload
```

3. **Launch the frontend**

```
run the index.html in the root of the repo
```

4. **Visit the documentation**

    [API Documentation](https://github.com/Jonathan2055/TripLens/blob/main/docs/api_documentation.md) 


## Example cURL Requests

**Get all trips**:

```bash
curl -X GET "http://localhost:8080/trip"
```

**Get trips by month**:

```bash
curl -X GET "http://localhost:8080/trip/month/3"
```

**Get trip by ID**:

```bash
curl -X GET "http://localhost:8080/trip/id0801584"
```

**Get all vendors**:

```bash
curl -X GET "http://localhost:8080/vendor"
```

---

## Video Walkthrough
You can find a short video walkthrough [here](https://drive.google.com/file/d/1jYv0h9LLT64bRyd-WWsYphlZI2s6Lo_C/view?usp=sharing).
**Use headphones when watching.**

##  Future Improvements (Optional Ideas)

* Add `POST`, `PUT`, and `DELETE` endpoints for CRUD operations
* Add authentication and authorization (JWT)
* Improve error handling with detailed logs
* Use SQLAlchemy instead of raw SQLite for better scalability
* Implement unit tests with `pytest`


