package main_test

import (
	"context"
	"testing"

	"github.com/shurcooL/graphql"
)

var client = graphql.NewClient("http://127.0.0.1:8080/query/", nil)

// var client = graphql.NewClient("https://blog.laisky.com/graphql/query/", nil)

type QueryHello struct {
	Hello graphql.String `graphql:"Hello"`
}

func TestShurCli(t *testing.T) {

	ctx := context.Background()
	query := new(QueryHello)
	if err := client.Query(ctx, query, nil); err != nil {
		t.Fatalf("got error: %+v", err)
	}

	t.Logf("got: %v", query.Hello)
	t.Error("all done")
}

type alertMutation struct {
	TelegramMonitorAlert struct {
		Name graphql.String
	} `graphql:"TelegramMonitorAlert(type: $type, token: $token, msg: $msg)"`
}

func TestShurMutation(t *testing.T) {
	query := new(alertMutation)
	vars := map[string]interface{}{
		"type":  graphql.String("hello"),
		"token": graphql.String("123"),
		"msg":   graphql.String("321"),
	}

	ctx := context.Background()
	if err := client.Mutate(ctx, query, vars); err != nil {
		t.Fatalf("%+v", err)
	}
}
