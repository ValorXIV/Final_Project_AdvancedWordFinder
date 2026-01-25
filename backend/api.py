from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from word_solver import Solver
import util
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
solver = None
word_list = []

@app.on_event("startup")
async def startup_event():
    global solver, word_list
    try:
        word_list, anagram_dict = util.import_dict()
        solver = Solver()
        print("Dictionary loaded successfully.")
    except Exception as e:
        print(f"Error loading dictionary: {e}")

@app.get("/search")
def search_words(
    pattern: str = Query(..., description="The word pattern to search for"),
    length: str = Query(None, description="Length constraint e.g. '5', '5-8', '-5'")
):
    if not solver:
        raise HTTPException(status_code=500, detail="Solver not initialized")
    
    current_word_list = word_list
    
    # Apply length constraint if present
    if length:
        try:
            min_len, max_len = solver.parse_length_constraint(length)
            current_word_list = [w for w in word_list if min_len <= len(w) <= max_len]
        except ValueError:
             raise HTTPException(status_code=400, detail="Invalid length format")

    try:
        if ";" in pattern:
             results = solver.solve_multi_query(pattern, current_word_list)
             # solve_multi_query returns a list of variable value sets
             # We need to decide how to return this. For now let's flatten union of all valid words 
             # found in the variables? Or just the words that matched?
             # Actually, solve_multi_query returns `matching_word` which is appended `value` (a set of words).
             # So it is a list of sets.
             flat_results = []
             for group in results:
                 flat_results.extend(list(group))
             final_results = sorted(list(set(flat_results)))
        else:
             final_results = sorted(solver.solve_single_query(pattern, current_word_list))
        
        return {"results": final_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
