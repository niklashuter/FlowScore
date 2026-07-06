import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function DashboardPage(){
    return (
        <div className="space-y-6">
            <PageTitle
                title="Dashboard"
                description="Your daily performance overview."
            />

            <Card>
                <h2 className="text-xl font-semibold text-white">
                    Welcome to Flowscore
                </h2>

                <p className="mt-2 text-slate-400">
                    Your daily performance overview will appear here.
                </p>

                <div  className="mt-6">
                    <Button>
                        Get started 
                    </Button>
                </div>

                <div className="mt-6 max-w-sm">
                    <Input
                        type="text"
                        placeholder="Test input"
                    />
                </div>
            </Card>
        </div>
    );
}

export default DashboardPage;