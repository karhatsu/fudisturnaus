Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      namespace :public do
        resources :contacts, only: :create
        resources :tournaments, only: [:index, :show]
      end

      namespace :official do
        resources :matches, only: :update
        resources :tournaments, only: [:show, :update] do
          put 'group_stage_results/:match_id' => 'group_stage_results#update'
          put 'playoff_results/:match_id' => 'playoff_results#update'
          resources :age_groups, only: [:create, :update, :destroy]
          resources :fields, only: [:create, :update, :destroy]
          resources :groups, only: [:create, :update, :destroy] do
            put 'lottery' => 'lotteries#update'
          end
          resources :group_stage_matches, only: [:create, :update, :destroy]
          resources :playoff_matches, only: [:create, :update, :destroy]
          resources :teams, only: [:create, :update, :destroy]
        end
        resources :clubs, only: :create
      end

      namespace :admin do
        resources :admin_sessions, only: :create
        resources :clubs, only: [:index, :update]
        resources :tournaments, only: :create
      end
    end
  end

  namespace :results do
    get ':results_access_key' => 'results#index'
  end

  namespace :official do
    get ':access_key/management' => 'official#index'
    get ':access_key' => 'official#index'
  end

  namespace :admin do
    root to: 'admin#index'
    get '*path', to: "admin#index"
  end

  resources :tournaments, only: :show

  root to: 'home#index'
  get '*path', to: "home#index"
end
