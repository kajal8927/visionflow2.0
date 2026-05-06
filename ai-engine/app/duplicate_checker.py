from difflib import SequenceMatcher


def check_duplicates(current_idea: str, existing_ideas: list[str]) -> dict:
    """
    Compare current idea against existing ideas
    and return duplicate percentage.
    """

    if not existing_ideas:
        return {
            "duplicatePercentage": 0
        }

    current = (current_idea or "").lower()

    highest_similarity = 0

    for idea in existing_ideas:
        similarity = SequenceMatcher(
            None,
            current,
            (idea or "").lower()
        ).ratio()

        highest_similarity = max(
            highest_similarity,
            similarity
        )

    duplicate_percentage = round(
        highest_similarity * 100,
        2
    )

    return {
        "duplicatePercentage": duplicate_percentage
    }