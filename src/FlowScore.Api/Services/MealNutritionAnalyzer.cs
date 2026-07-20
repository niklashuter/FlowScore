using FlowScore.Api.Models;
using Microsoft.Extensions.Configuration;
using OpenAI.Chat;
using System.Text.Json;


namespace FlowScore.Api.Services;

public class MealNutritionAnalyzer
{
    private readonly ChatClient _chatClient;

    public MealNutritionAnalyzer(IConfiguration configuration)
    {
        var apiKey = configuration["OpenAI:ApiKey"];
        var model = configuration["OpenAI:Model"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "OpenAI API key was not found."
            );
        }

        if (string.IsNullOrWhiteSpace(model))
        {
            throw new InvalidOperationException(
                "OpenAI model was not configured."
            );
        }

        _chatClient = new ChatClient(
            model,
            apiKey
        );
    }

    private const string SystemPrompt = """
        You are a sports nutrition expert for an application called FlowScore.

        Evaluate the nutritional quality of one described meal for an active adult.
        Consider its usefulness for daily energy, training and recovery, but score
        only the nutritional characteristics defined below.

        First assign one overall NutritionScore from 0 to 100.

        The NutritionScore must represent the overall quality of the meal as a whole.
        Do not calculate it as an average of the category scores.
        Do not force the category scores to mathematically match the NutritionScore.
        The category scores are explanatory details only.
        The category scores should explain why the meal received its NutritionScore.
        They do not need to average to the NutritionScore.
        A meal may receive a high NutritionScore even if one or two category scores are only moderate.

        Evaluate the overall meal realistically for everyday healthy eating.
        A healthy, simple everyday meal should usually score between 75 and 90.
        Reserve scores below 50 for clearly poor meals.
        Reserve scores above 95 for exceptionally balanced meals.

        Use the provided meal type when evaluating the meal.

        - Breakfast should be evaluated as a typical breakfast.
        - Lunch should be evaluated as a typical lunch.
        - Dinner should be evaluated as a typical dinner.

        If the meal type is Snack:
        - Evaluate it specifically as a snack.
        - Do not compare it to a complete breakfast, lunch or dinner.
        - A snack is not expected to contain every macronutrient or a broad range of micronutrients.
        - Evaluate whether it serves a useful nutritional purpose, such as providing energy, protein, fibre or healthy fats.
        - Simple healthy snacks such as fruit, natural yogurt, nuts or a high-quality protein bar generally fall within a NutritionScore of 70 to 90, depending on their ingredients and level of processing.
        - A minimally processed single food can still be a good snack even if it is not nutritionally complete.
        - Reserve scores below 50 for snacks that are clearly poor choices, heavily processed or nutritionally weak.

        Score each category from 0 to 100:

        Evaluate each category in the context of the provided meal type.
        Do not heavily penalize a snack for naturally focusing on only one or two nutritional strengths.

        - ProteinScore:
        Evaluate the quality and likely amount of protein.

        - CarbohydrateScore:
        Evaluate the quality and usefulness of the carbohydrate sources for energy.

        - HealthyFatScore:
        Evaluate the presence and quality of healthy fat sources.

        - MicronutrientScore:
        Evaluate the likely contribution of vegetables, fruits, fibre, vitamins
        and minerals.

        - ProcessingScore:
        Give a high score to minimally processed foods and a low score to heavily
        processed foods.

        NutritionScore guidelines:
        - 90–100: Excellent, highly balanced meal.
        - 80–89: Very healthy everyday meal with only minor improvements.
        - 70–79: Good meal with some room for improvement.
        - 50–69: Average meal with noticeable nutritional weaknesses.
        - 30–49: Poor nutritional quality.
        - 0–29: Very unhealthy meal.

        Important rules:

        - Evaluate only the ingredients explicitly mentioned.
        - If an ingredient is not explicitly mentioned, do not assume it is present.
        - Do not invent ingredients, preparation methods or nutritional values.
        - Assume reasonable portion sizes unless the description states otherwise.
        - Do not judge the meal based on calories alone.
        - Do not expect one meal to cover the entire daily nutritional requirement.
        - Consider the normal purpose of the meal.
        - Use the full scoring range.
        - Keep scoring consistent across similar meals.
        - Do not penalize healthy, simple meals for not being perfect. Evaluate realistically for everyday nutrition rather than ideal sports nutrition.
        - If important nutritional information is missing, make conservative but realistic assumptions.
        - Do not reward or penalize foods for ingredients that are unknown.

        Nutrition feedback requirements:
        - Return exactly 3 bullet points.
        - The first 2 bullet points must describe positive aspects of the meal.
        - The last bullet point must contain one concrete improvement suggestion.
        - Keep each bullet point short (maximum 5 words).
        - Be specific and practical.
        - Do not use markdown headings or introductions.
        - Return only the bullet points.
        """;

    private const string ResponseSchema = """
    {
        "type": "object",
        "properties": {
            "nutritionScore": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
            },
            "proteinScore": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
            },
            "carbohydrateScore": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
            },
            "healthyFatScore": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
            },
            "micronutrientScore": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
            },
            "processingScore": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
            },
            "feedback": {
            "type": "string"
            }
        },
        "required": [
        "nutritionScore",
        "proteinScore",
        "carbohydrateScore",
        "healthyFatScore",
        "micronutrientScore",
        "processingScore",
        "feedback"
    ],
        "additionalProperties": false
    }
    """;

    public async Task<MealNutritionAnalysis> AnalyzeMealAsync(
        string mealDescription,
        string mealType
    )
    {
        if (string.IsNullOrWhiteSpace(mealDescription))
        {
            throw new ArgumentException(
                "Meal description must not be empty.",
                nameof(mealDescription)
            );
        }

        if (string.IsNullOrWhiteSpace(mealType))
        {
            throw new ArgumentException(
                "Meal type must not be empty.",
                nameof(mealType)
            );
        }

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(SystemPrompt),
            new UserChatMessage(
                $"""
                Meal type: {mealType}

                Description:
                {mealDescription}
                """
            )
        };

        var options = new ChatCompletionOptions
        {
            ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                jsonSchemaFormatName: "meal_analysis",
                jsonSchema: BinaryData.FromString(ResponseSchema),
                jsonSchemaIsStrict: true
            )
        };

        ChatCompletion completion = await _chatClient.CompleteChatAsync(
            messages,
            options
        );

        var json = completion.Content[0].Text;

        var analysis = JsonSerializer.Deserialize<MealNutritionAnalysis>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }
        );

        if (analysis is null)
        {
            throw new InvalidOperationException(
                "The OpenAI response could not be deserialized."
            );
        }
        return analysis;
    }
}