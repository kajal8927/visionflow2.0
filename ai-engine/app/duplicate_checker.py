from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

def check_duplicate(text: str, existing_ideas: List[str]) -> dict:
    """
    Checks the similarity of the given idea text against a provided list 
    of existing ideas using TF-IDF and Cosine Similarity.
    """
    if not text.strip() or not existing_ideas:
        return {"duplicatePercentage": 0}

    # Combine the new idea with existing ones for vectorization
    corpus = [text] + existing_ideas
    
    # Create the TF-IDF matrix
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
    except ValueError:
        # Handle cases where text has no meaningful English words
        return {"duplicatePercentage": 0}
    
    # Calculate cosine similarity between the new idea (index 0) and all existing ideas
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
    
    # Get the maximum similarity score
    max_similarity = similarities.max()
    
    # Convert to percentage
    duplicate_percentage = int(max_similarity * 100)
    
    return {
        "duplicatePercentage": duplicate_percentage
    }
