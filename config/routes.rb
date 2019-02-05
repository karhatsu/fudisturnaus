Rails.application.routes.draw do
  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      resources :tournaments, only: [:index, :show]
      namespace :official do
        resources :group_stage_matches, only: :update
      end
    end
  end

  namespace :official do
    get ':access_key' => 'official#index'
  end

  root to: 'home#index'
  get '*path', to: "home#index"
end
