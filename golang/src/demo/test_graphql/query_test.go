package test

import (
	"context"
	"net/http"
	"testing"

	"github.com/Laisky/graphql"
)

type gcpLockQuery struct {
	Lock struct {
		Name      graphql.String `graphql:"name"`
		ExpiresAt graphql.String `graphql:"expires_at"`
	} `graphql:"Lock(name: $name)"`
}

func TestQueryWithHTTPGet(t *testing.T) {
	ctx := context.Background()
	httpClient := http.DefaultClient
	query := new(gcpLockQuery)
	vars := map[string]interface{}{
		"name": graphql.String("laisky.123"),
	}
	gracli := graphql.NewClient(
		"https://blog.laisky.com/graphql/query/",
		httpClient,
	)
	if err := gracli.Query(ctx, query, vars); err != nil {
		t.Fatalf("%+v", err)
	}

}
