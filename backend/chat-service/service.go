package chatservice

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	aiservice "github.com/sukvij/health-checker/backend/ai-service"
	"gorm.io/gorm"
)

// History represents a single message entry in the chat history.
// type History struct {
// 	Id             int    `json:"id" gorm:"primaryKey;autoIncrement"`
// 	ConversationId string `json:"conversation_id" gorm:"index"` // Add index for faster lookups
// 	MessageText    string `json:"message_text"`
// 	Response       string `json:"response"`
// 	// You might want to add a timestamp for ordering:
// 	// CreatedAt time.Time `json:"created_at"`
// }

type HistoryService struct {
	Db *gorm.DB
}

// ConversationSummary represents a simplified view of a conversation for the sidebar list.
type ConversationSummary struct {
	ConversationId string `json:"conversation_id"`
	Title          string `json:"title"` // The title of the conversation (e.g., first message)
}

func HistroyRoute(app *gin.Engine, db *gorm.DB) {
	service := &HistoryService{Db: db}
	app.GET("/history/:user_id", service.GetAllHistoryById) // This now gets ALL conversation summaries
	// app.GET("/history_by_id", service.GetHistoryByConversationId) // New endpoint for specific history
	app.POST("/history", service.CreateHistory) // Your existing POST endpoint
}

func (service *HistoryService) CreateHistory(ctx *gin.Context) {
	var chat ChatMessage
	ctx.ShouldBindJSON(&chat)
	var previousMessages []ChatMessage
	service.Db.Raw("select * from chat_messages where user_id = ?", chat.UserId).Scan(&previousMessages)
	geminiReqPayload := InsertpreviousMessages(previousMessages, chat.Text)
	result := aiservice.CallGemini(geminiReqPayload)
	chat.Response = result.AIMessage
	service.Db.Create(&chat)
	ctx.JSON(200, chat.Response)
}

// GetAllHistory returns a list of all unique conversation summaries.
// This is used to populate the sidebar with clickable chat entries.
func (service *HistoryService) GetAllHistoryById(ctx *gin.Context) {
	var conversationSummaries []ChatMessage
	x := ctx.Param("user_id")
	userId, _ := strconv.Atoi(x)
	// Query to get distinct conversation_ids and the first message_text as a title.
	// We order by the maximum 'id' (assuming higher ID means more recent activity in that conversation)
	// to bring recently active chats to the top of the list.
	// In a real app, if you had a `CreatedAt` or `UpdatedAt` timestamp on the History struct,
	// you'd use `MAX(created_at)` or `MAX(updated_at)` for better ordering.
	// err := service.Db.Table("histories").
	// 	Select("conversation_id, MIN(message_text) as title"). // MIN(message_text) gets the first message as title
	// 	Group("conversation_id").
	// 	Order("MAX(id) DESC"). // Order by the highest ID in each conversation to get most recent first
	// 	Scan(&conversationSummaries).Error

	err := service.Db.Where("user_id = ?", userId).Find(&conversationSummaries).Error

	if err != nil {
		log.Printf("Error fetching all conversation summaries: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch conversation list"})
		return
	}

	// If a conversation has no message_text (e.g., only bot's initial greeting),
	// or if MIN(message_text) isn't a good title, you might want to default it.
	// for i := range conversationSummaries {
	// 	if conversationSummaries[i].Title == "" {
	// 		conversationSummaries[i].Title = "New Chat" // Default title for empty or untitled chats
	// 	}
	// }

	ctx.JSON(http.StatusOK, conversationSummaries)
}

// GetHistoryByConversationId returns the full chat history for a specific conversation ID.
// This is used when a user clicks on a chat in the sidebar.
// func (service *HistoryService) GetHistoryByConversationId(ctx *gin.Context) {
// 	conversationID := ctx.Query("conversation_id")
// 	if conversationID == "" {
// 		ctx.JSON(http.StatusBadRequest, gin.H{"error": "conversation_id is required"})
// 		return
// 	}

// 	var previousMessages []
// 	// Order by ID to ensure messages are in chronological order within the conversation
// 	err := service.Db.Where("conversation_id = ?", conversationID).
// 		Order("id ASC"). // Assuming 'id' is auto-incrementing and indicates order
// 		Find(&previousMessages).Error

// 	if err != nil {
// 		log.Printf("Error fetching history for conversation ID %s: %v", conversationID, err)
// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat history"})
// 		return
// 	}

//		ctx.JSON(http.StatusOK, previousMessages)
//	}
func InsertpreviousMessages(previousMessages []ChatMessage, currMessage string) *aiservice.GeminiAPIRequest {
	// --- Construct Gemini API Request with History ---
	var geminiContents []struct {
		Role  string `json:"role"`
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	}

	// Add previous messages from history to Gemini's contents
	for _, msg := range previousMessages {
		geminiContents = append(geminiContents, struct {
			Role  string `json:"role"`
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		}{
			Role: "user",
			Parts: []struct {
				Text string `json:"text"`
			}{
				{Text: fmt.Sprintf("use previous history which i am passing and answer in 50 words for the question -- %v", msg.Text)},
			},
		})
	}

	// Add the current user message
	geminiContents = append(geminiContents, struct {
		Role  string `json:"role"`
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	}{
		Role: "user",
		Parts: []struct {
			Text string `json:"text"`
		}{
			{Text: currMessage},
		},
	})

	geminiReqPayload := aiservice.GeminiAPIRequest{
		Contents: geminiContents,
		GenerationConfig: struct {
			ResponseMimeType string `json:"responseMimeType"`
		}{
			ResponseMimeType: "text/plain",
		},
	}
	return &geminiReqPayload
}
