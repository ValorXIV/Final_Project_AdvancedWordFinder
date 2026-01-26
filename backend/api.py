from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import util
import query_handler
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

from pydantic import BaseModel

class DictionaryLoadRequest(BaseModel):
    filename: str

# Global instances
word_list = []
anagram_dict = {}
current_dict_file = "UKACD.txt"
DICT_DIR = os.path.join(os.path.dirname(__file__), "dictionary")

@app.on_event("startup")
async def startup_event():
    load_dictionary(current_dict_file)

def load_dictionary(filename: str):
    global word_list, anagram_dict, current_dict_file
    
    try:
        word_list, anagram_dict = util.import_dict(filename)
        current_dict_file = filename
        print(f"Dictionary {filename} loaded successfully.")
    except Exception as e:
        print(f"Error loading dictionary {filename}: {e}")
        
        # If loading fails and we have no dictionary, try default UKACD
        if not word_list and filename != "UKACD.txt":
            try:
                print("Attempting to fallback to UKACD.txt")
                word_list, anagram_dict = util.import_dict("UKACD.txt")
                current_dict_file = "UKACD.txt"
            except Exception as e2:
                print(f"Critical error loading default dictionary: {e2}")

@app.get("/dictionaries")
def get_dictionaries():
    """List all available dictionary .txt files in the dictionary directory."""
    try:
        if not os.path.exists(DICT_DIR):
            return {"dictionaries": [], "current": current_dict_file}
            
        files = [f for f in os.listdir(DICT_DIR) if os.path.isfile(os.path.join(DICT_DIR, f)) and f.endswith('.txt')]
        return {"dictionaries": files, "current": current_dict_file}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing files: {str(e)}")

@app.post("/dictionaries/load")
def load_dict_endpoint(request: DictionaryLoadRequest):
    """Load a specific dictionary file."""
    file_path = os.path.join(DICT_DIR, request.filename)
    if not os.path.exists(file_path):
         raise HTTPException(status_code=404, detail="Dictionary file not found")
    
    load_dictionary(request.filename) 
    return {"message": f"Dictionary {request.filename} loaded", "word_count": len(word_list)}

@app.get("/search")
def search_words(
    pattern: str = Query(..., description="The word pattern to search for (e.g. 5:A... or A.B)"),
    dictionary: str = Query(None, description="The dictionary file to use")
):
    global current_dict_file
    try:
        # Lazy load dictionary if requested and different
        if dictionary and dictionary != current_dict_file:
            print(f"Lazy loading dictionary: {dictionary} (was {current_dict_file})")
            load_dictionary(dictionary) # This updates global word_list and current_dict_file
        
        pattern = pattern.strip()
        final_results = query_handler.handle_query(pattern, word_list, anagram_dict)
        
        # Ensure we return a list, handle_query might return a set or list depending on implementation updates
        if isinstance(final_results, set):
            final_results = sorted(list(final_results))
        elif isinstance(final_results, list):
             # Ensure it's sorted if it isn't already, though handle_query usually returns sorted or we accept it as is
             pass

        return {"results": final_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
